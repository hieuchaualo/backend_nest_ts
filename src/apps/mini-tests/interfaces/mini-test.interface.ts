import IQuiz from './quiz.interface';
import { IAccount } from '../../accounts/interfaces/account.interface';
import { MiniTestTypes } from 'src/apps/utils';

export interface IMiniTest {
  title: string;
  content: string;
  typeOfQuiz: string | MiniTestTypes;
  quizzes:  [IQuiz] | [string];
  thumbnail: string;
  creator: string | IAccount;
}

export default IMiniTest;
