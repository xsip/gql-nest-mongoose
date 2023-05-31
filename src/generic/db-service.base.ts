import { Document, HydratedDocument, Model } from 'mongoose';

export class DbServiceBase<T> {
  constructor(private Model: Model<T>) {}
  async create(createDto: Partial<T>): Promise<HydratedDocument<T>> {
    const createdCat = new this.Model(createDto);
    return createdCat.save();
  }

  async findAll(): Promise<HydratedDocument<T>[]> {
    return this.Model.find().exec();
  }
  async findById(id: string): Promise<HydratedDocument<T>> {
    return this.Model.findById(id).exec();
  }
  findOne = this.Model.findOne;
}
