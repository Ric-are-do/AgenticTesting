import type { AppConfig } from '@core/app';
import { automationExercise } from './automation-exercise/app.config';
import { qapracticeCom } from './qapractice-com/app.config';
import { thathaZonke } from './thatha-zonke/app.config';

export const apps: AppConfig[] = [automationExercise, qapracticeCom, thathaZonke];
