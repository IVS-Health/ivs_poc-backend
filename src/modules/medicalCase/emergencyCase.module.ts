import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmergencyCaseService } from "./emergencyCase.service";
import { EmergencyCaseController } from "./emergencyCase.controller";
import { EmergencyCase } from "./emergencyCase.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyCase])],
  providers: [EmergencyCaseService],
  controllers: [EmergencyCaseController],
})
export class EmergencyCaseModule {}
