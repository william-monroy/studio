'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { evaluateAnswerFeedback } from '@/ai/flows/evaluate-answer-feedback';
import { mockQuestions, mockLeaderboard } from './mock-data';
import type { GameAnswer, GameSession, ScoreEntry, Question } from './types';

// Mock database
const gameSessions: Map<string, GameSession> = new Map();
const scores: ScoreEntry[] = [...mockLeaderboard];

const nicknameSchema = z.string().min(2, "El nickname debe tener al menos 2 caracteres.").max(16, "El nickname no puede tener más de 16 caracteres.");

export async function startGame(prevState: any, formData: FormData) {
  const nickname = formData.get('nickname');
  const validation = nicknameSchema.safeParse(nickname);

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const sessionId = crypto.randomUUID();
  const questions = [...mockQuestions].filter(q => q.active).sort((a, b) => a.order - b.order);

  const newSession: GameSession = {
    id: sessionId,
    nickname: validation.data,
    startedAt: Date.now(),
    answers: [],
    score: 0,
    totalTimeMs: 0,
    questions: questions,
    currentQuestionIndex: 0,
  };

  gameSessions.set(sessionId, newSession);

  redirect(`/play?sessionId=${sessionId}`);
}

export async function evaluateAnswer(sessionId: string, questionId: string, decision: 'YES' | 'NO', timeTakenMs: number) {
  const session = gameSessions.get(sessionId);
  const question = mockQuestions.find(q => q.id === questionId);

  if (!session || !question) {
    throw new Error('Invalid session or question ID');
  }

  // Securely determine outcome on the server
  const randomValue = crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff;
  const outcome = randomValue < question.successProb ? 'SUCCESS' : 'FAIL';
  
  const feedback = await evaluateAnswerFeedback({
    questionText: question.text,
    decision,
    outcome,
    nickname: session.nickname,
  });

  const answer: GameAnswer = {
    questionId,
    decision,
    outcome,
    timeMs: timeTakenMs,
  };

  session.answers.push(answer);
  session.totalTimeMs += timeTakenMs;
  if (outcome === 'SUCCESS') {
    session.score += 1;
  }
  session.currentQuestionIndex += 1;

  gameSessions.set(sessionId, session);

  const mediaUrl = outcome === 'SUCCESS' ? question.mediaPosUrl : question.mediaNegUrl;
  
  const isFinished = session.currentQuestionIndex >= session.questions.length;
  if(isFinished) {
    await finishGame(sessionId);
  }

  return {
    outcome,
    feedback: feedback.feedback,
    mediaUrl,
    isFinished,
  };
}

export async function finishGame(sessionId: string) {
    const session = gameSessions.get(sessionId);
    if (!session) {
        throw new Error('Invalid session ID');
    }

    session.endedAt = Date.now();

    const newScore: ScoreEntry = {
        id: session.id,
        nickname: session.nickname,
        score: session.score,
        totalTimeMs: session.totalTimeMs,
        createdAt: session.endedAt,
    };

    scores.push(newScore);
    // Sort scores: score desc, time asc, date desc
    scores.sort((a, b) => {
        if (b.score !== a.score) {
        return b.score - a.score;
        }
        if (a.totalTimeMs !== b.totalTimeMs) {
        return a.totalTimeMs - b.totalTimeMs;
        }
        return b.createdAt - a.createdAt;
    });

    gameSessions.set(sessionId, session);
}


export async function getGameSession(sessionId: string): Promise<GameSession | null> {
    return gameSessions.get(sessionId) || null;
}

export async function getLeaderboard(): Promise<ScoreEntry[]> {
    return scores.slice(0, 50);
}

export async function getQuestions(): Promise<Question[]> {
    return mockQuestions.filter(q => q.active).sort((a, b) => a.order - b.order);
}
