export type PhaseId = 'modelagem' | 'capacitacao' | 'comercializacao' | 'lancamento';

export type InitiativeStatus = 'on_track' | 'attention' | 'completed';

export interface PhaseInfo {
  id: PhaseId;
  number: string;
  name: string;
  description: string;
  focus: string;
}

export interface ReadinessItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface SocialInitiative {
  id: string;
  name: string;
  segment: string;
  community: string;
  coordinator: string;
  beneficiariesCount: number;
  currentPhase: PhaseId;
  status: InitiativeStatus;
  statusLabel: string;
  targetGoLiveDate: string;
  progressPercentage: number;
  purpose: string;
  readinessChecklist: ReadinessItem[];
  bottleneck?: {
    title: string;
    description: string;
    actionPlan: string;
    responsible: string;
  };
}
