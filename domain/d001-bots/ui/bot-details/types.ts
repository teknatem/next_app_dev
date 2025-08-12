export type BotFormData = {
  name: string;
  gender: string;
  position: string;
  hierarchyLevel: number;
  avatarUrl: string;
  primaryColor: string;
  role: string;
  goals: string;
  rules: string;
  llmProvider: string;
  llmModel: string;
};

export type BotFormErrors = Partial<Record<keyof BotFormData, string>>;
