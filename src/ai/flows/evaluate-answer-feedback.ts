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
  prompt: `You are a game master providing feedback to players in a decision-making game. The player's nickname is {{{nickname}}}.

  Based on the question, the player's decision (YES or NO), and the outcome (SUCCESS or FAIL), generate personalized feedback.

  Question: {{{questionText}}}
  Player's Decision: {{{decision}}}
  Outcome: {{{outcome}}}

  Provide feedback that is engaging, insightful, and helps the player understand the consequences of their decision. Keep the feedback short and sweet.
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
