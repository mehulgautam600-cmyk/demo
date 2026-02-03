export interface SubjectScores {
  physics: number;
  chemistry: number;
  biology: number;
}

export interface TestRecord {
  id: string;
  date: string;
  testName: string;
  scores: SubjectScores;
  total: number;
  feedback?: string; // Optional AI feedback cached
}

export interface AIAnalysisRequest {
  history: TestRecord[];
}

export interface TrendStatus {
  direction: 'up' | 'down' | 'stable';
  difference: number;
}
