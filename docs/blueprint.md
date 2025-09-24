# **App Name**: DecisionVerse

## Core Features:

- Nickname Input: Accept user's nickname to start a game; requires validation of 2-16 characters.
- Game Engine: Presents a series of Yes/No questions (mini-cases) with a timer for each question.
- Timed Responses: Configurable timer for each question. Failing to answer within the time limit defaults to 'No'.
- Server-Side Result Calculation: A server action `evaluateAnswer(sessionId, questionId, decision)` calculates the outcome based on the probability defined by the admin for each question using a secure crypto random number generator (tool).
- Visual Feedback: Display a brief GIF/image corresponding to the outcome of each question. Pre-loads media for the next question.
- Score Calculation and Leaderboard: Calculates the final score based on correct decisions and stores it in Firebase for the leaderboard.
- Admin Panel: Protected admin area for CRUD operations on questions and settings.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to convey intelligence, future and trust. 
- Background color: Light Indigo (#F0E6FF), a desaturated shade of the primary color to keep with the purple hues in a light scheme.
- Accent color: Soft Lavender (#E6E6FA), an analogous color to indigo, providing a gentle contrast for interactive elements.
- Headline font: 'Space Grotesk' sans-serif for a techy, scientific feel used in the heading, body: 'Inter', sans-serif.
- Use consistent and clear icons from @iconify/react, related to decision-making and outcomes.
- Responsive layout using HeroUI components, optimized for different screen sizes. Utilize Next.js 15's app router for efficient data fetching.
- Subtle animations with framer-motion for transitions, and react-confetti/canvas-confetti for correct answers to provide engaging feedback.