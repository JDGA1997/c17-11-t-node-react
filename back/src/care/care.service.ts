import { Injectable } from '@nestjs/common';
import { CreateCareDTO, UpdateCareDTO } from './dto/care.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Care } from './schemas/care.schema';
import { Model, Types } from 'mongoose';
import { MongooseService } from '@Helpers/mongoose/mongoose.service';

@Injectable()
export class CareService {
  constructor(
    @InjectModel(Care.name) private careModel: Model<Care>,
    private mongooseService: MongooseService,
  ) {}

  async create(data: CreateCareDTO, userId: string) {
    const { caretaker, pet, services, ...req } = data;
    return this.careModel.create({
      user: this.mongooseService.stringToObjectId(userId),
      caretaker: this.mongooseService.stringToObjectId(caretaker),
      pet: this.mongooseService.stringToObjectId(pet),
      services: this.mongooseService.stringToObjectId(services),
      date: new Date(),
      ...req,
    });
  }

  async findAll() {
    return this.careModel
      .find()
      .populate({ path: 'user', select: 'first_name last_name picture' })
      .populate({ path: 'pet', select: 'name' })
      .populate({ path: 'services', select: '' })
      .populate({ path: 'caretaker', select: '' })
      .exec();
  }

  async findAllPaginate(page: number, limit: number) {
    const count = await this.careModel.estimatedDocumentCount();
    const query = this.careModel
      .find()
      .populate({ path: 'user', select: 'first_name last_name picture' })
      .populate({ path: 'pet', select: 'name' })
      .populate({ path: 'services', select: '' })
      .populate({ path: 'caretaker', select: '' });

    return this.mongooseService.paginate<Care>(query, count, page, limit);
  }

  async findById(id: string) {
    try {
      return this.careModel
        .findById(id)
        .populate({ path: 'user', select: 'first_name last_name picture' })
        .populate({ path: 'pet', select: 'name' })
        .populate({ path: 'services', select: '' })
        .populate({ path: 'caretaker', select: '' })
        .exec();
    } catch (error) {
      throw new Error(`Error finding care by id: ${error.message}`);
    }
  }

  async findByCaretaker(caretakerId: string) {
    const caretakerObjectId = new Types.ObjectId(caretakerId);
    try {
      return this.careModel.find({ caretaker: caretakerObjectId }).exec();
    } catch (error) {
      throw new Error(`Error finding cares by caretaker ID: ${error.message}`);
    }
  }

  async update(data: UpdateCareDTO, userId: string) {
    const { services, pet, caretaker, ...req } = data;
    return this.careModel.findOneAndUpdate(
      {
        user: this.mongooseService.stringToObjectId(userId),
      },
      {
        caetaker: this.mongooseService.stringToObjectId(caretaker),
        services: this.mongooseService.stringToObjectId(services),
        pets: this.mongooseService.stringToObjectId(pet),
        ...req,
      },
      {
        new: true,
      },
    );
  }

  async delete(careId: string) {
    try {
      return await this.careModel.findByIdAndDelete(careId).exec();
    } catch (error) {
      throw new Error(`Error deleting care: ${error.message}`);
    }
  }
}