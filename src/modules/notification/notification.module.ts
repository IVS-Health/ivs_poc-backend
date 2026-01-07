import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsService } from "./notification.service";
import { NotificationsController } from "./notification.controller";
import { Token } from "../token/token.entity";
import { Notification } from "./notification.entity";
import { EmergencyCase } from "../medicalCase/emergencyCase.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, Notification, EmergencyCase]),
    // forwardRef(() => UsersModule), // uncomment if UsersModule is needed
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService], // optional if used in other modules
})
export class NotificationsModule {}
