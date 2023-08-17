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
    private readonly readingTipModel: Model<ReadingTipDocument>,
  ) { }

  async createReadingTip(
    createReadingTipDto: CreateReadingTipDto,
    file: Express.Multer.File,
  ): Promise<ReadingTip> {
    const thumbnailPath = `reading-tip-thumbnails/${file?.filename || 'default.png'}`;
    const newReadingTip = new this.readingTipModel(createReadingTipDto);
    newReadingTip.thumbnail = thumbnailPath;
    return newReadingTip.save();
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

    const readingTipsCount = await this.readingTipModel
      .find(filter)
      .count()
      .exec();

    if (readingTipsCount == 0) return new Pagination([], limit, 1, 1);
    const totalPage = Math.ceil(readingTipsCount / limit);

    if (totalPage < page) page = totalPage;

    // pagination
    const readingTips = await this.readingTipModel
      .find(filter)
      .skip(limit * page - limit)
      .limit(limit)
      .select({ content: false })
      .populate('creator', 'name')
      .sort({ updatedAt: -1 })
      .exec();

    return new Pagination(
      readingTips,
      limit,
      page,
      totalPage,
    );
  }

  async getReadingTipById(id: string): Promise<ReadingTip> {
    const readingTip = this.readingTipModel
      .findById(id)
      .populate('creator', 'name')
      .exec();
    return readingTip;
  }

  async getNextReadingTipById(id: string): Promise<ReadingTip[]> {
    const miniTests = this.readingTipModel
      .find({ _id: { $lt: id } })
      .sort({ _id: -1 })
      .limit(1)
      .select({ _id: true })
      .exec();

    return miniTests;
  }

  async getPreviousReadingTipById(id: string): Promise<ReadingTip[]> {
    const miniTests = this.readingTipModel
      .find({ _id: { $gt: id } })
      .sort({ _id: -1 })
      .limit(1)
      .select({ _id: true })
      .exec();

    return miniTests;
  }

  async findReadingTipByIdAndUpdate(
    id: string,
    file: Express.Multer.File,
    updateReadingTipDto: UpdateReadingTipDto,
  ) {
    const readingTip = this.readingTipModel
      .findByIdAndUpdate(id, {
        ...updateReadingTipDto,
        thumbnail: `reading-tip-thumbnails/${file.filename}`,
      })
      .exec();
    return readingTip;
  }

  async findReadingTipByIdAndUpdateNoThumbnail(
    id: string,
    updateReadingTipDto: UpdateReadingTipDto,
  ) {
    const readingTip = this.readingTipModel
      .findByIdAndUpdate(id, updateReadingTipDto)
      .exec();
    return readingTip;
  }

  async deleteReadingTipById(id: string) {
    const deletedReadingTip = this.readingTipModel
      .findByIdAndDelete(id)
      .exec();
    return deletedReadingTip;
  }
}
