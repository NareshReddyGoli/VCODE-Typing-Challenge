export interface StudentDetails {
  name: string;
  registrationNumber: string;
  email: string;
  mobileNumber: string;
  year: string;
  section: string;
}

export interface AttemptResult {
  attemptNumber: number;
  wpm: number;
  accuracy: number;
  timestamp: Date;
}

export interface ContestState {
  studentDetails: StudentDetails | null;
  attempts: AttemptResult[];
  contestStartTime: Date | null;
  contestEndTime: Date | null;
  currentAttemptStartTime: Date | null;
  isContestActive: boolean;
  hasAgreedToRules: boolean;
}

export type PageType = 'registration' | 'instructions' | 'contest' | 'results';
