import { IMiniTest } from "../../mini-tests/interfaces"

export interface IMiniTestHistory {
  _id?: string;
  miniTest?: string | IMiniTest;
  timeLimit?: number;
  timeTaken?: number;
  totalQuestions?: number;
  totalCorrectAnswers?: number;
  createdAt?: string;
  updatedAt?: string;
}
