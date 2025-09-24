'use server';

/**
 * @fileOverview Generates personalized feedback for the player's answer using AI.
 *
 * - evaluateAnswerFeedback - A function that generates feedback based on the question, decision, and outcome.
 * - EvaluateAnswerFeedbackInput - The input type for the evaluateAnswerFeedback function.
 * - EvaluateAnswerFeedbackOutput - The return type for the evaluateAnswerFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateAnswerFeedbackInputSchema = z.object({
  questionText: z.string().describe('The text of the question asked.'),
  decision: z.enum(['YES', 'NO']).describe('The player\'s decision (YES or NO).'),
  outcome: z.enum(['SUCCESS', 'FAIL']).describe('The outcome of the decision (SUCCESS or FAIL).'),
  nickname: z.string().describe('The player\'s nickname.'),
});
export type EvaluateAnswerFeedbackInput = z.infer<typeof EvaluateAnswerFeedbackInputSchema>;

const EvaluateAnswerFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback for the player\'s answer.'),
});
export type EvaluateAnswerFeedbackOutput = z.infer<typeof EvaluateAnswerFeedbackOutputSchema>;

export async function evaluateAnswerFeedback(input: EvaluateAnswerFeedbackInput): Promise<EvaluateAnswerFeedbackOutput> {
  return evaluateAnswerFeedbackFlow(input);
}

const evaluateAnswerFeedbackPrompt = ai.definePrompt({
  name: 'evaluateAnswerFeedbackPrompt',
  input: {schema: EvaluateAnswerFeedbackInputSchema},
  output: {schema: EvaluateAnswerFeedbackOutputSchema},
  prompt: `Eres un maestro de juego que proporciona retroalimentación a los jugadores en un juego de toma de decisiones. El apodo del jugador es {{{nickname}}}.

  Basándote en la pregunta, la decisión del jugador (SÍ o NO), y el resultado (ÉXITO o FALLO), genera retroalimentación personalizada EN ESPAÑOL.

  Pregunta: {{{questionText}}}
  Decisión del Jugador: {{{decision}}}
  Resultado: {{{outcome}}}

  Proporciona retroalimentación que sea atractiva, perspicaz y ayude al jugador a entender las consecuencias de su decisión. Mantén la retroalimentación breve y dulce. SIEMPRE responde en español, sin importar el idioma de la pregunta.
  `,
});

const evaluateAnswerFeedbackFlow = ai.defineFlow(
  {
    name: 'evaluateAnswerFeedbackFlow',
    inputSchema: EvaluateAnswerFeedbackInputSchema,
    outputSchema: EvaluateAnswerFeedbackOutputSchema,
  },
  async input => {
    const {output} = await evaluateAnswerFeedbackPrompt(input);
    return output!;
  }
);
