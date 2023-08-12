import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto, RegisterAccountDto, UpdateAccountDto, UpdateForAccountDto } from './dto';
import { Account, AccountDocument } from './schemas/account.schema';
import * as bcrypt from 'bcrypt';
import { LoginAccountDto } from './dto/login-account.dto';
import { sign } from 'jsonwebtoken';
import { IAccount } from './interfaces/account.interface';
import { Pagination, SearchDto } from '../utils';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) { }

  signToken(email: string) {
    return sign({ 'email': email }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRES_IN });
  }

  async checkByPayload(payload: any) {
    return this.accountModel.findOne({ email: payload.email });
  }

  async register(registerAccountDto: RegisterAccountDto) {
    const hashedPassword = await bcrypt.hash(registerAccountDto.password, SALT_OR_ROUNDS);
    registerAccountDto.password = hashedPassword;

    const avatarPath = `avatars/default.png`;
    registerAccountDto.avatar = avatarPath;

    const registeredAccount = await this.accountModel.create(registerAccountDto);
    const token = this.signToken(registeredAccount.email);
    return { registeredAccount, token };
  }

  async create(createAccountDto: CreateAccountDto) {
    const hashedPassword = await bcrypt.hash(createAccountDto.password, SALT_OR_ROUNDS);
    createAccountDto.password = hashedPassword;

    const avatarPath = `avatars/default.png`;
    createAccountDto.avatar = avatarPath;

    const createdAccount = await this.accountModel.create(createAccountDto);
    const token = this.signToken(createdAccount.email);
    return { createdAccount, token };
  }

  async login(loginAccountDto: LoginAccountDto) {
    const account = await this.accountModel.findOne({ email: loginAccountDto.email }).exec();
    if (!account) {
      throw new HttpException('Unauthorized: Wrong email or password', 401);
    }
    if (await bcrypt.compare(loginAccountDto.password, account.password)) {
      const token = this.signToken(account.email);
      return { account, token };
    } else {
      throw new HttpException('Unauthorized: Wrong email or password', 401);
    }
  }

  async searchAccounts(searchMiniTestDto: SearchDto): Promise<Pagination> {
    let page = searchMiniTestDto.page || 1;
    const limit = searchMiniTestDto.limit || 12;
    const keywords = searchMiniTestDto.keywords;
    const filter = { title: { $regex: keywords, $options: 'i' } };
    if (!keywords) delete filter.title;

    let sortOptions: any = { createdAt: -1 }
    const option = searchMiniTestDto.option;
    if (option) sortOptions = { ...sortOptions, ...JSON.parse(searchMiniTestDto.option) }

    const accountsCount = await this.accountModel.find(filter).count().exec();

    if (accountsCount == 0) return new Pagination([], limit, 1, 1);
    const totalPage = Math.ceil(accountsCount / limit);

    if (totalPage < page) page = totalPage;

    // pagination
    const accounts = await this.accountModel
      .find(filter)
      .skip(limit * page - limit)
      .limit(limit)
      .select({ password: false })
      .sort(sortOptions)
      .exec();

    return new Pagination(
      accounts,
      limit,
      page,
      totalPage,
    );
  }

  async findById(id: string): Promise<IAccount> {
    return this.accountModel.findById(id).exec();
  }

  async updateAvatar(
    updateAccountDto: UpdateAccountDto,
    file: Express.Multer.File,
  ): Promise<IAccount> {
    const avatarPath = `avatars/${file?.filename || 'default.png'}`;

    const account = this.accountModel
      .findByIdAndUpdate(updateAccountDto._id, { avatar: avatarPath }, { new: true }) // return updated doc
      .exec();
    return account;
  }

  async findByIdAndUpdate(id: string, updateAccountDto: UpdateForAccountDto): Promise<IAccount> {
    if (updateAccountDto.password) {
      const hashedPassword = await bcrypt.hash(updateAccountDto.password, SALT_OR_ROUNDS);
      updateAccountDto.password = hashedPassword;
    }
    const account = this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true }) // return updated doc
      .exec();
    return account;
  }

  async findByIdAndDelete(id: string) {
    const deletedAccount = await this.accountModel.findByIdAndDelete(id).exec();
    return deletedAccount;
  }
}
