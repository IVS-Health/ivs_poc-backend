import { forwardRef, Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { TokenController } from "./token.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "./token.entity";
import { User } from "../users/user.entity";
import { UsersModule as UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    forwardRef(() => UsersModule),
  ],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
