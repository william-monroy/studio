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

---

## Original Idea:

Rol: Eres un/a Senior Frontend Engineer construyendo un juego web con Next.js 15 (App Router) + TypeScript + HeroUI + Firebase + @iconify/react + next-themes. Debe ser rápido, accesible y fácil de administrar por un panel de admin.

Un jugador ingresa su nickname y empieza una partida.

Verá N preguntas (mini-casos) de Sí/No (ej: “¿Invertir en propiedades en el metaverso?”).

Cada pregunta tiene un temporizador (segundos configurables). Si no responde a tiempo, cuenta como No (configurable).

El admin define para cada pregunta un porcentaje de éxito (probabilidad) y medios (gif/imagen) para resultado Positivo/Negativo.

Tras responder, el juego calcula servidor-side (no en el cliente) el resultado aleatorio según la probabilidad y muestra un gif/imagen breve acorde al resultado, luego avanza.

Al final, se calcula la puntuación (basada en “decisiones acertadas”) y se guarda en Firebase para mostrar un leaderboard (TOP jugadores).

El admin puede crear/editar/borrar preguntas, cambiar textos, probabilidades, tiempo por pregunta y URLs de medios.

### Tech & libraries:

Next.js 15 (App Router, Server Actions, RSC donde aplique). (https://nextjs.org/docs)

TypeScript estricto.

HeroUI para UI (componentes de UI y toast). (https://www.heroui.com/docs/)

Firebase (Auth con anonymous para jugadores y google/email para admin; Firestore; Storage para subir gifs/imagenes; Rules).

@iconify/react para iconos.

next-themes (light/dark) implementado con HeroUI segun su documentacion.

Extras: framer-motion (transiciones), react-confetti o canvas-confetti (aciertos), zod (validación), zustand (estado local), usehooks-ts (temporizador).

### Flujo de usuario:

/ (Home): input de nickname (validar 2–16 chars). Botón “Jugar”.

/play: motor del juego.

Muestra pregunta i/N, temporizador, botones Sí/No (teclas Y/N).

Al responder o al vencer el tiempo:

Llama Server Action evaluateAnswer(sessionId, questionId, decision) → calcula en servidor el resultado con probabilidad y crypto seguro.

Guarda evento en Firestore.

Muestra gif/imagen de resultado durante ~1–2 s (pre-cargar medios sig. pregunta).

Avanza hasta la última pregunta.

/results: muestra puntuación, detalles (aciertos/errores) y leaderboard (Top 50).

/admin (protegido): CRUD de preguntas y ajustes.

/admin/questions (lista/paginación, activar/desactivar).

/admin/questions/new y /admin/questions/[id] (form: texto, prob éxito 0–1, tiempo en segundos, urls media positiva/negativa, orden).

Upload a Firebase Storage con vista previa.

### Logica de puntuacion

Puntaje final = suma de aciertos.

Tiebreaker leaderboard: menor tiempo total y luego fecha más reciente.

### Datos y modelos (TypeScript)

// /types/game.ts export type Question = { id: string; text: string; successProb: number; // 0..1 timeLimitSec: number; // p.ej. 10 mediaPosUrl: string; // gif/img éxito mediaNegUrl: string; // gif/img fracaso active: boolean; order: number; // para ordenar updatedAt: number; };

export type GameAnswer = { questionId: string; decision: 'YES' | 'NO'; outcome: 'SUCCESS' | 'FAIL'; // calculado en servidor timeMs: number; // cuánto tardó };

export type GameSession = { id: string; nickname: string; startedAt: number; endedAt?: number; answers: GameAnswer[]; score?: number; totalTimeMs?: number; };

export type ScoreEntry = { id: string; // sessionId nickname: string; score: number; totalTimeMs: number; createdAt: number; };

### Esquema Firestore

#### collections
- questions/{id}: Question
- games/{sessionId}: GameSession
- (subcol) events/{k}
- scores/{sessionId}: ScoreEntry (denormalizado para query rápida)
#### indices
- scores(score desc, totalTimeMs asc, createdAt desc)
### Extra
Semilla de sesión para reproducibilidad (guardar rngSeed y rngIndex por sesión). Sonidos togglables para acierto/error. Métrica: envíos a Analytics (p.ej., eventos de pregunta, aciertos, abandonos).