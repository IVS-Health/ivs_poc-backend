import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Token } from "./token.entity";
import { TokenRegistrationDto } from "./dto/token.dto";
import { User } from "../users/user.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async saveToken(dto: TokenRegistrationDto) {
    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
      relations: { token: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // If user already has a token → update it
    if (user.token) {
      user.token.token = dto.token;
      this.tokenRepo.save(user.token);
      return;
    }

    // Else create new token record
    const tokenRegistration = this.tokenRepo.create({
      token: dto.token,
      user,
    });

    this.tokenRepo.save(tokenRegistration);
  }
  async getTokenByUserId(userId: TokenRegistrationDto["userId"]) {
    const tokenRecord = await this.tokenRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!tokenRecord) {
      throw new Error("Token not found for the user");
    }

    return tokenRecord.token;
  }
}
