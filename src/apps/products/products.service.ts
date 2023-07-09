import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateProductDto,
  GetSuggetedProductDto,
  SearchProductDto,
  Pagination,
} from './dto';
import { Product, ProductDocument } from './schemas';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  async create(
    createProductDto: CreateProductDto,
    picture: Express.Multer.File,
  ): Promise<Product> {
    const picturePath = `${process.env.SERVER_ENDPOINT}/products/${picture.filename}`;
    const newProduct = new this.productModel(createProductDto);
    newProduct.pictures[0] = picturePath;
    return await newProduct.save();
  }

  async getProducts(limit = 12): Promise<Product[]> {
    const products = this.productModel
      .find()
      .limit(limit)
      .select({
        description: 0,
        account: 0,
      })
      .sort({ 'updatedAt': -1 })
      .exec();
    return products;
  }

  async searchProducts(
    searchProductDto: SearchProductDto,
  ): Promise<Pagination> {
    let page = searchProductDto.page || 1;
    const limit = searchProductDto.limit || 12;
    const { categoryId, brandId, keywords } = searchProductDto;
    const filter = {
      $and: [
        (keywords) ? { name: { $regex: keywords, $options: 'i' } } : {},
        (brandId) ? { brand: brandId } : {},
        (categoryId) ? { category: categoryId } : {},
      ],
    };
    const productsCount = await this.productModel
      .find(filter)
      .count()
      .exec();

    if (productsCount == 0) return new Pagination([], limit, 1, 1);
    const totalPage = Math.ceil(productsCount / limit);

    if (totalPage < page) page = totalPage;

    // pagination
    const products = await this.productModel
      .find(filter)
      .skip(limit * page - limit)
      .limit(limit)
      .select({
        description: 0,
        account: 0,
      })
      .sort({ 'updatedAt': -1 })
      .exec();
    console.log(products)
    return new Pagination(
      products,
      limit,
      page,
      totalPage,
    );
  }

  async getProductDetail(id: string): Promise<Product> {
    const product = this.productModel
      .findById(id)
      .populate('brand', 'name')
      .populate('category', 'name')
      .populate('account', 'name')
      .exec();
    return product;
  }

  async getSameProductsBrandOrCategory(
    getSuggetedProductDto: GetSuggetedProductDto,
  ): Promise<Product[]> {
    const product = await this.productModel
      .findById(getSuggetedProductDto.id)
      .exec();

    if (product == null) return [];

    // get same brand product if exists
    const productsSameBrandCount =
      await this.countProductsSameBrand(product.brand.toString());

    if (productsSameBrandCount > 1)
      return this.getProductsSameBrand(
        product.brand.toString(),
        getSuggetedProductDto.id,
        getSuggetedProductDto.limit,
      );

    // if same brand product does not exists
    // get same category product if exists
    const productsSameCategoryCount =
      await this.countProductsSameCategory(product.category.toString());

    if (productsSameCategoryCount > 1)
      return this.getProductsSameCategory(
        product.category.toString(),
        getSuggetedProductDto.id,
        getSuggetedProductDto.limit,
      );

    // there is no same products
    return [];
  }

  async countProductsSameCategory(categoryId: string): Promise<number> {
    const productsSameCategoryCount = this.productModel.count({
      category: categoryId,
    });
    return productsSameCategoryCount;
  }

  async countProductsSameBrand(brandId: string): Promise<number> {
    const productsSameBrandCount = this.productModel.count({
      brand: brandId,
    });
    return productsSameBrandCount;
  }

  async getProductsSameBrand(brandId: string, productId: string, limit = 3) {
    const productsSameBrand = this.productModel
      .find({ brand: brandId, _id: { $nin: [productId] } })
      .limit(limit)
      .select({
        description: 0,
        brand: 0,
        account: 0,
        category: 0,
      })
      .exec();
    return productsSameBrand;
  }

  async getProductsSameCategory(categoryId: string, productId: string, limit = 3) {
    const productsSameCategory = this.productModel
      .find({ category: categoryId, _id: { $nin: [productId] } })
      .limit(limit)
      .select({
        description: 0,
        brand: 0,
        account: 0,
        category: 0,
      })
      .exec();
    return productsSameCategory;
  }

  getSetPicturesWillUpdate(
    _files: Array<Express.Multer.File>,
    _pictureAction: string,
  ) {
    // pictureAction is vitual array flat in string, but we need real array
    const pictureAction = _pictureAction.split(",");
    const setPicturesWillUpdate = {};
    // files is a array without null element, that lenght not fit with `pictureAction`
    let fileSetCounter = 0;

    // special for pictures[0], it's thumbnail, and that must not removed.
    if (pictureAction[0] === 'update') {
      const newKey = `pictures.0`;
      const newValue = `${process.env.SERVER_ENDPOINT}/products/${_files[fileSetCounter].filename}`;
      fileSetCounter++;
      Object.assign(
        setPicturesWillUpdate,
        {
          [newKey]: newValue,
        },
      );
    }

    for (let index = 1; index < pictureAction.length; index++) {
      if (pictureAction[index] === 'update') {
        const newKey = `pictures.${index}`;
        const newValue = `${process.env.SERVER_ENDPOINT}/products/${_files[fileSetCounter].filename}`;
        fileSetCounter++;
        Object.assign(
          setPicturesWillUpdate,
          {
            [newKey]: newValue,
          },
        );
      } else if (pictureAction[index] === 'delete') {
        const newKey = `pictures.${index}`;
        Object.assign(
          setPicturesWillUpdate,
          { [newKey]: "" },
        );
      }
    };
    return setPicturesWillUpdate;
  }

  async findByIdAndUpdate(
    id: string,
    files: Array<Express.Multer.File>,
    updateProductDto,
  ) {
    const setPicturesWillUpdate = this.getSetPicturesWillUpdate(
      files,
      updateProductDto.pictureAction,
    );
    const product = await this.productModel
      .findByIdAndUpdate(id, {
        name: updateProductDto.name,
        price: updateProductDto.price,
        category: updateProductDto.category,
        brand: updateProductDto.brand,
        description: updateProductDto.description,
        $set: setPicturesWillUpdate,
      })
      .exec();
    return product;
  }

  async delete(id: string) {
    const deletedProduct = this.productModel.findByIdAndDelete(id).exec();
    return deletedProduct;
  }
}
