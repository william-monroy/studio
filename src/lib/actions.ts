'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { evaluateAnswerFeedback } from '@/ai/flows/evaluate-answer-feedback';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy, limit, deleteDoc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import type { ScoreEntry, Question } from './types';
import { revalidatePath } from 'next/cache';

const nicknameSchema = z.string().min(2, "El nickname debe tener al menos 2 caracteres.").max(16, "El nickname no puede tener más de 16 caracteres.");

export async function startGame(prevState: any, formData: FormData): Promise<{success: boolean; questions?: Question[]; error?: string;}> {
  console.log("Attempting to start game...");
  const nickname = formData.get('nickname');
  const validation = nicknameSchema.safeParse(nickname);

  if (!validation.success) {
    const errorMessage = validation.error.errors[0].message;
    console.error("Nickname validation failed:", errorMessage);
    return { success: false, error: errorMessage };
  }
  
  try {
    // Get all questions first, then filter and sort in memory to avoid index requirement
    const allQuestions = await getQuestions();
    console.log(`Total questions in database: ${allQuestions.length}`);
    console.log('Questions data:', allQuestions.map(q => ({ id: q.id, text: q.text.substring(0, 50), active: q.active })));
    
    // Check if any questions don't have the active field and set them to active
    for (const question of allQuestions) {
      if (question.active === undefined || question.active === null) {
        console.log(`Setting question ${question.id} as active`);
        await updateDoc(doc(db, 'questions', question.id), { active: true });
        question.active = true; // Update local copy
      }
    }
    
    const questions = allQuestions
      .filter(q => q.active === true)
      .sort((a, b) => a.order - b.order);
    
    console.log(`Active questions found: ${questions.length}`);
    
    if (questions.length === 0) {
        console.warn("No active questions found.");
        // If no active questions but there are questions, let's use all questions as fallback
        if (allQuestions.length > 0) {
          console.log("Using all questions as fallback since no active questions found");
          const fallbackQuestions = allQuestions.sort((a, b) => a.order - b.order);
          return { success: true, questions: fallbackQuestions };
        }
        return { success: false, error: "No hay preguntas activas en este momento. Inténtalo más tarde." };
    }

    console.log(`Found ${questions.length} active questions.`);
    return { success: true, questions };

  } catch (error: any) {
    console.error('Failed to start game session:', error);
    return { success: false, error: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' };
  }
}

export async function evaluateAnswer(
  question: Question,
  decision: 'YES' | 'NO',
  nickname: string
) {
  const randomValue = Math.random();
  const outcome = randomValue < question.successProb ? 'SUCCESS' : 'FAIL';
  
  const feedbackResult = await evaluateAnswerFeedback({
    questionText: question.text,
    decision,
    outcome,
    nickname: nickname,
  });

  const mediaUrl = outcome === 'SUCCESS' ? question.mediaPosUrl : question.mediaNegUrl;
  
  return {
    outcome,
    feedback: feedbackResult.feedback,
    mediaUrl,
  };
}

export async function saveScore(scoreData: {nickname: string, score: number, totalTimeMs: number}) {
  const { nickname, score, totalTimeMs } = scoreData;
  const leaderboardCol = collection(db, 'leaderboard');

  try {
    // First check if player exists outside transaction
    const q = query(leaderboardCol, where('nickname', '==', nickname));
    const existingScores = await getDocs(q);

    await runTransaction(db, async (transaction) => {
      if (existingScores.empty) {
        // New player, add their score
        const newScoreRef = doc(leaderboardCol);
        transaction.set(newScoreRef, {
          nickname,
          score,
          totalTimeMs,
          createdAt: Date.now(),
        });
        console.log(`New score saved for ${nickname}`);
      } else {
        // Existing player, check if new score is better
        const existingDoc = existingScores.docs[0];
        const existingScoreData = existingDoc.data() as ScoreEntry;
        
        if (score > existingScoreData.score || (score === existingScoreData.score && totalTimeMs < existingScoreData.totalTimeMs)) {
          transaction.update(existingDoc.ref, {
            score,
            totalTimeMs,
            createdAt: Date.now(),
          });
          console.log(`High score updated for ${nickname}`);
        } else {
          console.log(`Score for ${nickname} is not a high score. Not updating.`);
        }
      }
    });

    revalidatePath('/results');
    revalidatePath('/admin/players');
    return { success: true };
  } catch (error) {
    console.error("Failed to save score transaction", error);
    return { success: false, error: 'Could not save score to leaderboard.'};
  }
}

export async function getLeaderboard(): Promise<ScoreEntry[]> {
    // Get all leaderboard entries and sort in memory to avoid index requirement
    const snapshot = await getDocs(collection(db, 'leaderboard'));
    
    let scores: ScoreEntry[] = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as ScoreEntry);
    
    // Sort by score (desc), then by totalTimeMs (asc), then by createdAt (desc)
    scores.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score; // Higher score first
        }
        if (a.totalTimeMs !== b.totalTimeMs) {
            return a.totalTimeMs - b.totalTimeMs; // Lower time first (faster)
        }
        return b.createdAt - a.createdAt; // More recent first
    });
    
    // Limit to top 50
    return scores.slice(0, 50);
}

export async function getQuestions(): Promise<Question[]> {
    const questionsSnapshot = await getDocs(query(collection(db, 'questions'), orderBy('order')));
    return questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
}

export async function getQuestion(id: string): Promise<Question | null> {
    const questionDoc = await getDoc(doc(db, 'questions', id));
    if (!questionDoc.exists()) {
        return null;
    }
    return { id: questionDoc.id, ...questionDoc.data() } as Question;
}

const questionSchema = z.object({
    text: z.string().min(10, 'El texto de la pregunta debe tener al menos 10 caracteres.'),
    successProb: z.coerce.number().min(0).max(1),
    timeLimitSec: z.coerce.number().int().min(5),
    mediaPosUrl: z.string().url('Por favor, introduce una URL válida.'),
    mediaNegUrl: z.string().url('Por favor, introduce una URL válida.'),
});

export async function createQuestion(prevState: any, formData: FormData): Promise<{success?: boolean; error?: string}> {
    const validation = questionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validation.success) {
        const errorMessage = validation.error.errors.map(e => e.message).join(', ');
        return { error: errorMessage };
    }
    
    const questionsCollection = collection(db, "questions");
    const questionsSnapshot = await getDocs(questionsCollection);
    const newOrder = questionsSnapshot.size + 1;

    try {
        await addDoc(questionsCollection, {
            ...validation.data,
            active: true,
            order: newOrder,
            updatedAt: Date.now(),
        });
        revalidatePath('/admin/questions');
        return { success: true };
    } catch (e) {
        console.error("Error creating question:", e);
        return { error: 'No se pudo crear la pregunta en la base de datos.'};
    }
}

export async function updateQuestion(id: string, prevState: any, formData: FormData): Promise<{success?: boolean; error?: string}> {
    const validation = questionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validation.success) {
        const errorMessage = validation.error.errors.map(e => e.message).join(', ');
        return { error: errorMessage };
    }

    try {
        await updateDoc(doc(db, 'questions', id), {
            ...validation.data,
            updatedAt: Date.now(),
        });
        revalidatePath('/admin/questions');
        revalidatePath(`/admin/questions/${id}`);
        return { success: true };
    } catch (e) {
        console.error("Error updating question:", e);
        return { error: 'No se pudo actualizar la pregunta en la base de datos.'};
    }
}


export async function deleteQuestion(id: string) {
    try {
        await deleteDoc(doc(db, 'questions', id));
        revalidatePath('/admin/questions');
    } catch (e) {
        console.error("Failed to delete question", e);
        // We throw an error to be caught by the client if needed
        throw new Error('Failed to delete question.');
    }
}

export async function clearLeaderboard(): Promise<{ success: boolean; message: string }> {
  try {
    const leaderboardCol = collection(db, 'leaderboard');
    const snapshot = await getDocs(leaderboardCol);
    
    // Delete all documents in the leaderboard collection
    const batch = [];
    for (const doc of snapshot.docs) {
      batch.push(deleteDoc(doc.ref));
    }
    
    await Promise.all(batch);
    
    revalidatePath('/admin/players');
    revalidatePath('/results');
    
    console.log(`Cleared ${snapshot.size} entries from leaderboard`);
    return { 
      success: true, 
      message: `Se eliminaron ${snapshot.size} entradas del leaderboard exitosamente.` 
    };
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return { 
      success: false, 
      message: 'Error al limpiar el leaderboard. Inténtalo de nuevo.' 
    };
  }
}

export async function initializeQuestionsFields(): Promise<{ success: boolean; message: string }> {
  try {
    const allQuestions = await getQuestions();
    let updatedCount = 0;
    
    for (const question of allQuestions) {
      const updates: any = {};
      let needsUpdate = false;
      
      // Check and set active field
      if (question.active === undefined || question.active === null) {
        updates.active = true;
        needsUpdate = true;
      }
      
      // Check and set order field
      if (question.order === undefined || question.order === null) {
        updates.order = updatedCount + 1;
        needsUpdate = true;
      }
      
      // Check and set updatedAt field
      if (question.updatedAt === undefined || question.updatedAt === null) {
        updates.updatedAt = Date.now();
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await updateDoc(doc(db, 'questions', question.id), updates);
        updatedCount++;
        console.log(`Updated question ${question.id} with fields:`, updates);
      }
    }
    
    revalidatePath('/admin/questions');
    
    return {
      success: true,
      message: `Se actualizaron ${updatedCount} preguntas con campos faltantes.`
    };
  } catch (error) {
    console.error('Error initializing questions fields:', error);
    return {
      success: false,
      message: 'Error al inicializar los campos de las preguntas.'
    };
  }
}

export async function getAnalyticsData() {
    // This is a placeholder for a more complex analytics query.
    // In a real app, this could involve aggregations or more complex data fetching.
    const questions = await getQuestions();
    const players = await getLeaderboard();
    
    // This is a simplified aggregation.
    let totalSuccess = 0;
    let totalFail = 0;
    
    // In a real app, you would fetch answer data. We will simulate it.
    // This is not efficient and is for demonstration purposes.
    const questionDecisions = questions.map(q => {
        const yes = Math.floor(Math.random() * 50);
        const no = Math.floor(Math.random() * 50);
        const success = Math.floor((yes * q.successProb) + (no * (1-q.successProb)));
        const fail = (yes + no) - success;
        totalSuccess += success;
        totalFail += fail;

        return {
            questionId: q.id,
            text: q.text,
            yes,
            no,
        }
    });

    const totalGames = players.length; // Simplified
    const averageScore = players.reduce((acc, p) => acc + p.score, 0) / (players.length || 1);

    return {
        totalPlayers: players.length,
        totalGames,
        averageScore: parseFloat(averageScore.toFixed(2)),
        overallSuccessRate: parseFloat(((totalSuccess / (totalSuccess + totalFail || 1)) * 100).toFixed(2)),
        successFailData: [
            { name: 'Success', value: totalSuccess, fill: 'hsl(var(--chart-2))' },
            { name: 'Fail', value: totalFail, fill: 'hsl(var(--destructive))' }
        ],
        questionDecisionsData: questionDecisions,
    };
}
