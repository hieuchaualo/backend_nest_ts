import IQuiz from './quiz.interface';
import { IAccount } from '../../accounts/interfaces/account.interface';

export interface IMiniTest {
  title: string;
  content: string;
  quizzes:  [IQuiz] | [string];
  thumbnail: string;
  creator: string | IAccount;
}

export default IMiniTest;
