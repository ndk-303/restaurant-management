import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from 'src/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private readonly mailService: MailerService,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    const {name, email, password, phone, address, image} = createUserDto;
    
    if (await this.userModel.exists({email: email})) {
      throw new BadRequestException(`Email exists: ${email}`)
    }
    //hash password
    const hashedPassword = await hashPassword(password) 
    const user = await this.userModel.create({
      name, email, password: hashedPassword, phone, address, image
    })
    return {
      _id: user._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const {filter, sort} = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems =  (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems/pageSize);
    const skip = (current - 1) * (pageSize);

    const result = await this.userModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .select('-password')
    .sort(sort as any)
    return { result, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {_id: updateUserDto._id},
      {...updateUserDto}
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.userModel.deleteOne({_id})
    } else {
      throw new BadRequestException('Invalid Id')
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    const {name, email, password} = createAuthDto;
    if (await this.userModel.exists({email: email})) {
      throw new BadRequestException(`Email exists: ${email}`)
    }
    //hash password
    const hashedPassword = await hashPassword(password) 
    const codeId = uuidv4()
    const user = await this.userModel.create({
      name, email, password: hashedPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    this.mailService.sendMail({
      to: user.email, 
      subject: "Activate your account at @joy's", 
      text: 'welcome', 
      template: 'register',
      context: {
        name: user.name,
        activationCode: codeId,
      }
    })

    return {
      _id: user._id
    }
  }

  
}
