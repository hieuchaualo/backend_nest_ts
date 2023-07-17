import { Account } from 'src/apps/accounts/schemas/account.schema';
import IQuiz from './quiz.interface';

export interface IReadingTest {
  title: string;
  content: string;
  quizzes:  [IQuiz] | [string];
  thumbnail: string;
  creator: string | Account;
}

export default IReadingTest;
