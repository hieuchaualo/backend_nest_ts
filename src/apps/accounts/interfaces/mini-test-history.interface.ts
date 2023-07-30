import { IMiniTest } from "../../mini-tests/interfaces"

export interface IMiniTestHistory {
  _id?: string;
  miniTest?: string | IMiniTest;
  timeTaken?: number;
  totalQuestions?: number;
  totalCorrectAnswers?: number;
  createdAt?: string;
  updatedAt?: string;
}
