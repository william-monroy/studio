import type { Question, ScoreEntry } from './types';

// This data will be used to populate Firestore if it's empty.
// After first run, data will be managed in the Admin panel.

export const mockQuestions: Omit<Question, 'id'>[] = [
  {
    text: '¿Invertir en propiedades en el metaverso?',
    successProb: 0.6,
    timeLimitSec: 15,
    mediaPosUrl: 'https://picsum.photos/seed/success1/600/400',
    mediaNegUrl: 'https://picsum.photos/seed/fail1/600/400',
    active: true,
    order: 1,
    updatedAt: Date.now(),
  },
  {
    text: '¿Lanzar una línea de zapatillas exclusivas para avatares?',
    successProb: 0.5,
    timeLimitSec: 15,
    mediaPosUrl: 'https://picsum.photos/seed/success2/600/400',
    mediaNegUrl: 'https://picsum.photos/seed/fail2/600/400',
    active: true,
    order: 2,
    updatedAt: Date.now(),
  },
  {
    text: '¿Reemplazar al equipo de soporte con IAs conversacionales?',
    successProb: 0.3,
    timeLimitSec: 10,
    mediaPosUrl: 'https://picsum.photos/seed/success3/600/400',
    mediaNegUrl: 'https://picsum.photos/seed/fail3/600/400',
    active: true,
    order: 3,
    updatedAt: Date.now(),
  },
  {
    text: '¿Deberíamos cambiar nuestro logo a un meme popular?',
    successProb: 0.2,
    timeLimitSec: 10,
    mediaPosUrl: 'https://picsum.photos/seed/success4/600/400',
    mediaNegUrl: 'https://picsum.photos/seed/fail4/600/400',
    active: true,
    order: 4,
    updatedAt: Date.now(),
  },
  {
    text: '¿Fusionar nuestra base de datos con una hoja de cálculo gigante?',
    successProb: 0.1,
    timeLimitSec: 15,
    mediaPosUrl: 'https://picsum.photos/seed/success5/600/400',
    mediaNegUrl: 'https://picsum.photos/seed/fail5/600/400',
    active: true,
    order: 5,
    updatedAt: Date.now(),
  },
];

export const mockLeaderboard: Omit<ScoreEntry, 'id'>[] = [
  { nickname: 'PlayerOne', score: 5, totalTimeMs: 35000, createdAt: Date.now() - 100000 },
  { nickname: 'CosmicRider', score: 4, totalTimeMs: 28000, createdAt: Date.now() - 200000 },
  { nickname: 'DataQueen', score: 4, totalTimeMs: 32000, createdAt: Date.now() - 50000 },
  { nickname: 'SynthWave', score: 3, totalTimeMs: 40000, createdAt: Date.now() - 300000 },
  { nickname: 'LogicLord', score: 2, totalTimeMs: 25000, createdAt: Date.now() - 150000 },
];
