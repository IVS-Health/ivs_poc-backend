import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { NotificationsModule } from "../notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => NotificationsModule), // if UsersService calls NotificationsService
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
