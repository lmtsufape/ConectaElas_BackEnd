import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::pontuacao.pontuacao",
  ({ strapi }) => ({
    validarJogo(jogo: string): boolean {
      const jogosValidos = [
        "quiz",
        "memoria",
        "palavracruzada",
        "cacapalavras",
      ];
      return jogosValidos.includes(jogo);
    },

    obterMultiplicador(jogo: string): number {
      const multiplicadores: Record<string, number> = {
        quiz: 1,
        memoria: 1.5,
        cacapalavras: 1.2,
        palavracruzada: 2,
      };
      return multiplicadores[jogo] || 1;
    },

    obterLimites(jogo: string): { min: number; max: number } {
      const limites: Record<string, { min: number; max: number }> = {
        quiz: { min: 0, max: 1000 },
        memoria: { min: 0, max: 1500 },
        cacapalavras: { min: 0, max: 1200 },
        palavracruzada: { min: 0, max: 2000 },
      };
      return limites[jogo] || { min: 0, max: 1000 };
    },

    calcularPontuacao(
      jogo: string,
      acertos: number,
      totalPerguntas: number,
    ): number {
      const multiplicador = this.obterMultiplicador(jogo);
      const limites = this.obterLimites(jogo);

      const percentual = (acertos / totalPerguntas) * 100;
      const pontuacaoCalculada = (percentual / 100) * 100 * multiplicador;
      const pontuacaoFinal = Math.round(pontuacaoCalculada);
      return Math.min(Math.max(pontuacaoFinal, limites.min), limites.max);
    },
  }),
);
