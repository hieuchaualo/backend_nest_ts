import { IAccount } from '../../accounts/interfaces/account.interface';

export interface IReadingTip {
  title: string;
  content: string;
  thumbnail: string;
  creator: string | IAccount;
}

export default IReadingTip;
