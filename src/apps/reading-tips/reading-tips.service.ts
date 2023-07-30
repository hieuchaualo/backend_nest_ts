import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateReadingTipDto,
  UpdateReadingTipDto,
} from './dto';
import { ReadingTip, ReadingTipDocument } from './schemas';
import { Pagination, SearchDto } from '../utils';

@Injectable()
export class ReadingTipsService {
  constructor(
    @InjectModel(ReadingTip.name)
    private readonly miniTestModel: Model<ReadingTipDocument>,
  ) { }

  async createReadingTip(
    createReadingTipDto: CreateReadingTipDto,
    file: Express.Multer.File,
  ): Promise<ReadingTip> {
    const thumbnailPath = `mini-test-thumbnails/${file?.filename || 'default.png'}`;
    const newReadingTip = new this.miniTestModel(createReadingTipDto);
    newReadingTip.thumbnail = thumbnailPath;
    return await newReadingTip.save();
  }

  async searchReadingTips(
    searchReadingTipDto: SearchDto,
  ): Promise<Pagination> {
    let page = searchReadingTipDto.page || 1;
    const limit = searchReadingTipDto.limit || 12;
    const keywords = searchReadingTipDto.keywords;
    const option = searchReadingTipDto.option;
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

  async getReadingTipById(id: string): Promise<ReadingTip> {
    const miniTest = this.miniTestModel
      .findById(id)
      .populate('creator', 'name')
      .exec();
    return miniTest;
  }

  async findReadingTipByIdAndUpdate(
    id: string,
    file: Express.Multer.File,
    updateReadingTipDto: UpdateReadingTipDto,
  ) {
    const miniTest = this.miniTestModel
      .findByIdAndUpdate(id, {
        ...updateReadingTipDto,
        thumbnail: `mini-test-thumbnails/${file.filename}`,
      })
      .exec();
    return miniTest;
  }

  async findReadingTipByIdAndUpdateNoThumbnail(
    id: string,
    updateReadingTipDto: UpdateReadingTipDto,
  ) {
    const miniTest = this.miniTestModel
      .findByIdAndUpdate(id, updateReadingTipDto)
      .exec();
    return miniTest;
  }

  async deleteReadingTipById(id: string) {
    const deletedReadingTip = this.miniTestModel
      .findByIdAndDelete(id)
      .exec();
    return deletedReadingTip;
  }
}
