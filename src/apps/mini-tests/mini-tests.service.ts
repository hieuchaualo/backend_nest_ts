import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateMiniTestDto,
  UpdateMiniTestDto,
} from './dto';
import { Account, AccountDocument } from '../accounts/schemas';
import { MiniTest, MiniTestDocument } from './schemas';
import { Pagination, SearchDto } from '../utils';
import { MiniTestHistoryDto } from '../accounts/dto';
import { IAccount, IMiniTestHistory } from '../accounts/interfaces';

@Injectable()
export class MiniTestsService {
  constructor(
    @InjectModel(MiniTest.name)
    private readonly accountModel: Model<AccountDocument>,
  
    @InjectModel(Account.name)
    private readonly miniTestModel: Model<MiniTestDocument>,
  ) { }

  async createMiniTest(
    createMiniTestDto: CreateMiniTestDto,
    file: Express.Multer.File,
  ): Promise<MiniTest> {
    const thumbnailPath = `mini-test-thumbnails/${file?.filename || 'default.png'}`;
    const newMiniTest = new this.miniTestModel(createMiniTestDto);
    newMiniTest.thumbnail = thumbnailPath;
    return await newMiniTest.save();
  }

  async searchMiniTests(
    searchMiniTestDto: SearchDto,
  ): Promise<Pagination> {
    let page = searchMiniTestDto.page || 1;
    const limit = searchMiniTestDto.limit || 12;
    const keywords = searchMiniTestDto.keywords;
    const option = searchMiniTestDto.option;
    const filter = { title: { $regex: keywords, $options: 'i' }, typeOfQuiz: option };
    if (!keywords) delete filter.title;
    if (!option) delete filter.typeOfQuiz;

    const miniTestsCount = await this.miniTestModel
      .find(filter)
      .count()
      .exec();

    if (miniTestsCount == 0) return new Pagination([], limit, 1, 1);
    const totalPage = Math.ceil(miniTestsCount / limit);

    if (totalPage < page) page = totalPage;

    // pagination
    const miniTests = await this.miniTestModel
      .find(filter)
      .skip(limit * page - limit)
      .limit(limit)
      .select({
        content: false,
        quizzes: false,
      })
      .populate('creator', 'name')
      .sort({ updatedAt: -1 })
      .exec();

    return new Pagination(
      miniTests,
      limit,
      page,
      totalPage,
    );
  }

  async getMiniTestById(id: string): Promise<MiniTest> {
    const miniTest = this.miniTestModel
      .findById(id)
      .populate('creator', 'name')
      .exec();
    return miniTest;
  }

  async getNextMiniTestById(id: string): Promise<MiniTest[]> {
    const miniTests = this.miniTestModel
      .find({ _id: { $gt: id } })
      .sort({ _id: -1 })
      .limit(1)
      .select({ _id: true })
      .exec();

    return miniTests;
  }

  async getMiniTestHistory(
    accountId: string,
  ): Promise<IMiniTestHistory[]> {

    const account = await this.accountModel
      .findById(accountId)
      .populate({
        path: "miniTestHistory",
        populate: {
          path: "miniTest",
          model: MiniTest.name,
          select: 'title',
        }
      })
      .sort({ 'miniTest.updatedAt': -1 })
      .exec()
    return account.miniTestHistory
  }

  async updateMiniTestHistory(
    id: string,
    miniTestHistoryDto: MiniTestHistoryDto,
  ): Promise<IAccount> {
    const account = this.accountModel
      .findByIdAndUpdate(
        id,
        { $push: { miniTestHistory: miniTestHistoryDto } },
        { new: true },
      )
      .exec();
    return account;
  }

  async findMiniTestByIdAndUpdate(
    id: string,
    file: Express.Multer.File,
    updateMiniTestDto: UpdateMiniTestDto,
  ) {
    const miniTest = this.miniTestModel
      .findByIdAndUpdate(id, {
        ...updateMiniTestDto,
        thumbnail: `mini-test-thumbnails/${file.filename}`,
      })
      .exec();
    return miniTest;
  }

  async findMiniTestByIdAndUpdateNoThumbnail(
    id: string,
    updateMiniTestDto: UpdateMiniTestDto,
  ) {
    const miniTest = this.miniTestModel
      .findByIdAndUpdate(id, updateMiniTestDto)
      .exec();
    return miniTest;
  }

  async deleteMiniTestById(id: string) {
    const deletedMiniTest = this.miniTestModel
      .findByIdAndDelete(id)
      .exec();
    return deletedMiniTest;
  }
}
