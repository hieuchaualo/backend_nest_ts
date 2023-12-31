import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto, RegisterAccountDto, UpdateForAccountDto } from './dto';
import { Account, AccountDocument } from './schemas/account.schema';
import * as bcrypt from 'bcrypt';
import { LoginAccountDto } from './dto/login-account.dto';
import { sign } from 'jsonwebtoken';
import { IAccount } from './interfaces/account.interface';
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
    console.log(payload)
    return this.accountModel.findOne({ email: payload.email });
  }

  async register(registerAccountDto: RegisterAccountDto) {
    const hashedPassword = await bcrypt.hash(registerAccountDto.password, SALT_OR_ROUNDS);
    registerAccountDto.password = hashedPassword;
    const registeredAccount = await this.accountModel.create(registerAccountDto);
    const token = this.signToken(registeredAccount.email);
    return { registeredAccount, token };
  }

  async create(createAccountDto: CreateAccountDto) {
    const hashedPassword = await bcrypt.hash(createAccountDto.password, SALT_OR_ROUNDS);
    createAccountDto.password = hashedPassword;
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

  async findAll(limit = '12'): Promise<Account[]> {
    return this.accountModel.find().limit(Number(limit)).exec();
  }

  async findById(id: string): Promise<IAccount> {
    return this.accountModel.findById(id).exec();
  }

  async findByIdAndUpdate(updateAccountDto: UpdateForAccountDto): Promise<IAccount> {
    if (updateAccountDto.password) {
      const hashedPassword = await bcrypt.hash(updateAccountDto.password, SALT_OR_ROUNDS);
      updateAccountDto.password = hashedPassword;
    }
    const account = this.accountModel
      .findByIdAndUpdate(updateAccountDto._id, updateAccountDto, { new: true }) // return updated doc
      .exec();
    return account;
  }

  async findByIdAndDelete(id: string) {
    const deletedAccount = await this.accountModel.findByIdAndDelete(id).exec();
    return deletedAccount;
  }
}
