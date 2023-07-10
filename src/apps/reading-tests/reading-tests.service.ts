import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateReadingTestDto,
  SearchReadingTestDto,
  UpdateReadingTestDto,
} from './dto';
import { ReadingTest, ReadingTestDocument } from './schemas';
import { Pagination } from '../utils';

@Injectable()
export class ReadingTestsService {
  constructor(
    @InjectModel(ReadingTest.name)
    private readonly readingTestModel: Model<ReadingTestDocument>,
  ) { }

  async createReadingTest(
    createReadingTestDto: CreateReadingTestDto,
    file: Express.Multer.File,
  ): Promise<ReadingTest> {
    const thumbnailPath = `${process.env.SERVER_ENDPOINT}/reading-test-thumbnails/${file?.filename || 'default.png'}`;
    const newReadingTest = new this.readingTestModel(createReadingTestDto);
    newReadingTest.thumbnail = thumbnailPath;
    return await newReadingTest.save();
  }

  async getReadingTests(limit = 12): Promise<ReadingTest[]> {
    const readingTests = this.readingTestModel
      .find()
      .limit(limit)
      .select({
        content: -1,
        quiz: -1,
      })
      .populate('creator', 'name')
      .sort({ updatedAt: -1 })
      .exec();
    return readingTests;
  }

  async searchReadingTests(
    searchReadingTestDto: SearchReadingTestDto,
  ): Promise<Pagination> {
    let page = searchReadingTestDto.page || 1;
    const limit = searchReadingTestDto.limit || 12;
    const keywords = searchReadingTestDto.keywords;
    const filter = keywords ? { name: { $regex: keywords, $options: 'i' } } : {};
    const readingTestsCount = await this.readingTestModel
      .find(filter)
      .count()
      .exec();

    if (readingTestsCount == 0) return new Pagination([], limit, 1, 1);
    const totalPage = Math.ceil(readingTestsCount / limit);

    if (totalPage < page) page = totalPage;

    // pagination
    const readingTests = await this.readingTestModel
      .find(filter)
      .skip(limit * page - limit)
      .limit(limit)
      .select({
        content: -1,
        quiz: -1,
      })
      .populate('creator', 'name')
      .sort({ updatedAt: -1 })
      .exec();

    return new Pagination(
      readingTests,
      limit,
      page,
      totalPage,
    );
  }

  async getReadingTestById(id: string): Promise<ReadingTest> {
    const readingTest = this.readingTestModel
      .findById(id)
      .populate('creator', 'name')
      .exec();
    return readingTest;
  }

  async findReadingTestByIdAndUpdate(
    id: string,
    file: Express.Multer.File,
    updateReadingTestDto: UpdateReadingTestDto,
  ) {
    const readingTest = this.readingTestModel
      .findByIdAndUpdate(id, {
        ...updateReadingTestDto,
        thumbnail: `${process.env.SERVER_ENDPOINT}/reading-test-thumbnails/${file.filename}`,
      })
      .exec();
    return readingTest;
  }

  async deleteReadingTestById(id: string) {
    const deletedReadingTest = this.readingTestModel
      .findByIdAndDelete(id)
      .exec();
    return deletedReadingTest;
  }
}
