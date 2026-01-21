import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto, LoginDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, name, age, medicalSpecialty } = createUserDto;

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException("Email already registered");
    }

    const user = this.userRepo.create({ email, name, age, medicalSpecialty });
    await this.userRepo.save(user);
    return user;
  }

  async findByEmail(email: LoginDto["email"]) {
    if (!email) {
      throw new BadRequestException("Email query parameter is required");
    }

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }
}
