import { VideoRenderer } from './video-renderer';
import { TextRenderer } from './text-renderer';
import { QuizRenderer } from './quiz-renderer';

const renderers: Record<string, typeof VideoRenderer> = {
  video: VideoRenderer,
  texto: TextRenderer,
  questao: QuizRenderer,
};

export function getContentRenderer(tipo: string) {
  return renderers[tipo] || null;
}

export { VideoRenderer, TextRenderer, QuizRenderer };
