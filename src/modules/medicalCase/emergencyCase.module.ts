import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmergencyCaseService } from "./emergencyCase.service";
import { EmergencyCaseController } from "./emergencyCase.controller";
import { EmergencyCase } from "./emergencyCase.entity";
import { NotificationsModule } from "../notification/notification.module";

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyCase]), NotificationsModule],
  providers: [EmergencyCaseService],
  controllers: [EmergencyCaseController],
})
export class EmergencyCaseModule {}
