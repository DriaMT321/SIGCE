export const tokenevaluacionalertatemprana = Symbol('EARLY_WARNING_EVALUATION');

export interface puertoevaluacionalertatemprana {
  ejecutarsiesposible(idestudiante: string): Promise<void>;
}
