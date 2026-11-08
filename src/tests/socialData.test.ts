import { describe, it, expect } from 'vitest';
import { PHASES, INITIAL_INITIATIVES } from '../data/socialData';

describe('Modelo de Dados: Implanta (Empreendedorismo Social & Operações)', () => {
  it('deve conter as 4 fases estruturadas da esteira de maturação', () => {
    expect(PHASES).toHaveLength(4);
    expect(PHASES[0].id).toBe('modelagem');
    expect(PHASES[1].id).toBe('capacitacao');
    expect(PHASES[2].id).toBe('comercializacao');
    expect(PHASES[3].id).toBe('lancamento');
  });

  it('deve conter as 4 iniciativas comunitárias da carteira ativa', () => {
    expect(INITIAL_INITIATIVES).toHaveLength(4);
    const ids = INITIAL_INITIATIVES.map((item) => item.id);
    expect(ids).toContain('tecendo-autonomia');
    expect(ids).toContain('quitanda-da-terra');
    expect(ids).toContain('biosaberes-floresta');
    expect(ids).toContain('estudio-jovem-criativo');
  });

  it('deve validar consistência da Quitanda da Terra com ponto de atenção e ancoragem técnica real', () => {
    const quitanda = INITIAL_INITIATIVES.find((item) => item.id === 'quitanda-da-terra');
    expect(quitanda).toBeDefined();
    expect(quitanda?.status).toBe('attention');
    expect(quitanda?.progressPercentage).toBe(50); // 2 de 4 portões = exatamente 50%
    expect(quitanda?.bottleneck).toBeDefined();
    expect(quitanda?.bottleneck?.responsible).toContain('Thayâne Carvalho');
    expect(quitanda?.bottleneck?.title).toContain('RDC 727/Anvisa');
    expect(quitanda?.bottleneck?.actionPlan).toContain('ficha técnica');
    expect(quitanda?.readinessChecklist.filter((r) => r.completed)).toHaveLength(2);
  });

  it('deve validar consistência do Estúdio Jovem Criativo como concluído e autossustentável', () => {
    const estudio = INITIAL_INITIATIVES.find((item) => item.id === 'estudio-jovem-criativo');
    expect(estudio).toBeDefined();
    expect(estudio?.status).toBe('completed');
    expect(estudio?.progressPercentage).toBe(100);
    expect(estudio?.readinessChecklist.every((r) => r.completed)).toBe(true);
  });

  it('todas as iniciativas devem ter exatamente 4 critérios objetivos de prontidão (25% por portão)', () => {
    INITIAL_INITIATIVES.forEach((item) => {
      expect(item.readinessChecklist).toHaveLength(4);
      expect(item.beneficiariesCount).toBeGreaterThan(0);
      expect(item.community).toBeTruthy();
      expect(item.coordinator).toBeTruthy();

      const completedCount = item.readinessChecklist.filter((r) => r.completed).length;
      const expectedPercentage = Math.round((completedCount / 4) * 100);
      expect(item.progressPercentage).toBe(expectedPercentage);
    });
  });
});
