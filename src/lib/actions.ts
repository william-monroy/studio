'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { evaluateAnswerFeedback } from '@/ai/flows/evaluate-answer-feedback';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { GameAnswer, GameSession, ScoreEntry, Question } from './types';
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
    const questionsSnapshot = await getDocs(query(collection(db, 'questions'), where('active', '==', true), orderBy('order')));
    const questions: Question[] = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    
    if (questions.length === 0) {
        console.warn("No active questions found.");
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
  const randomValue = crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff;
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
  const newScore: Omit<ScoreEntry, 'id'> = {
    nickname: scoreData.nickname,
    score: scoreData.score,
    totalTimeMs: scoreData.totalTimeMs,
    createdAt: Date.now(),
  };

  try {
    await addDoc(collection(db, 'leaderboard'), newScore);
    revalidatePath('/results');
    return { success: true };
  } catch (error) {
    console.error("Failed to save score", error);
    return { success: false, error: 'Could not save score to leaderboard.'};
  }
}

export async function getLeaderboard(): Promise<ScoreEntry[]> {
    const leaderboardQuery = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), orderBy('totalTimeMs', 'asc'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(leaderboardQuery);
    
    let scores: ScoreEntry[] = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as ScoreEntry);
    
    return scores;
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

export async function createQuestion(prevState: any, formData: FormData) {
    const validation = questionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors };
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
        redirect('/admin/questions');
    } catch (e) {
        return { error: { _general: 'Error al crear la pregunta. Inténtalo de nuevo.' } };
    }
}

export async function updateQuestion(id: string, prevState: any, formData: FormData) {
    const validation = questionSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors };
    }

    try {
        await updateDoc(doc(db, 'questions', id), {
            ...validation.data,
            updatedAt: Date.now(),
        });
        revalidatePath('/admin/questions');
        revalidatePath(`/admin/questions/${id}`);
        redirect('/admin/questions');
    } catch (e) {
        return { error: { _general: 'Error al actualizar la pregunta. Inténtalo de nuevo.' } };
    }
}

export async function deleteQuestion(id: string) {
    try {
        await deleteDoc(doc(db, 'questions', id));
        revalidatePath('/admin/questions');
    } catch (e) {
        // In a real app, you'd want better error handling, maybe a toast notification.
        console.error("Failed to delete question", e);
    }
    redirect('/admin/questions');
}
