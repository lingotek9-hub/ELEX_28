export interface SecretariatNomination {
  nominationType: 'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح' | '';
  candidateName: string;
  reasonsAndQualifications: string;
}

export interface SecretariatEvaluationDetail {
  rating: number; // 1 to 5
  notes?: string;
}

export interface PreviousSecretariatEvaluation {
  overallRating: number; // 1 to 5
  generalSecretariatEval?: SecretariatEvaluationDetail;
  academicSecretariatEval?: SecretariatEvaluationDetail;
  financialSecretariatEval?: SecretariatEvaluationDetail;
  socialSecretariatEval?: SecretariatEvaluationDetail;
  positivePoints?: string; // أبرز الإيجابيات والإنجازات
  improvementPoints?: string; // الملاحظات ونقاط التطوير
}

export interface NominationSubmission {
  id?: string;
  responseId?: string;
  timestamp: string;
  // Nominator info
  nominatorFullName: string;
  academicId: string;
  phoneNumber: string;
  // Previous Association / Secretariat Evaluation
  previousEvaluation?: PreviousSecretariatEvaluation;
  // Secretariats
  generalSecretariat: SecretariatNomination;
  academicSecretariat: SecretariatNomination;
  financialSecretariat: SecretariatNomination;
  socialSecretariat: SecretariatNomination;
  // Feedback
  additionalFeedback?: string;
}

export interface GoogleFormConfig {
  formId: string;
  title: string;
  description: string;
  editUrl: string;
  responderUri: string;
  createdAt: string;
}

export interface GoogleSheetConfig {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  createdAt: string;
  lastSyncedAt?: string;
  totalSyncedRows?: number;
}
