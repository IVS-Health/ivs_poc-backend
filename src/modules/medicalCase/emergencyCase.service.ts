import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmergencyCase } from "./emergencyCase.entity";
import { EmergencyCaseDto } from "./dto/emergencyCase.dto";
import { NotificationsService } from "../notification/notification.service";

@Injectable()
export class EmergencyCaseService {
  constructor(
    @InjectRepository(EmergencyCase)
    private readonly emergencyCaseRepo: Repository<EmergencyCase>,
    private readonly notificationService: NotificationsService
  ) {}

  async registerNewCase(emergencyCaseDto: EmergencyCaseDto) {
    const { location, callBackNumber, natureOfEmergency, patientCondition } =
      emergencyCaseDto;

    const emergencyCase = this.emergencyCaseRepo.create({
      location,
      callBackNumber,
      natureOfEmergency,
      patientCondition,
    });
    await this.emergencyCaseRepo.save(emergencyCase);
  }

  async findAllCases() {
    const cases = await this.emergencyCaseRepo.find({
      relations: ["assignedTo"], // 👈 THIS IS THE FIX
    });

    if (!cases.length) {
      throw new NotFoundException(`No cases found`);
    }

    return cases;
  }

  async findEmergencyCase(caseId: number) {
    const emergencyCase = await this.emergencyCaseRepo.findOne({
      where: { id: caseId },
    });
    if (!emergencyCase) {
      throw new NotFoundException(`Emergency case with ID ${caseId} not found`);
    }
    return emergencyCase;
  }

  async cancelCase(caseId: number) {
    const emergencyCase = await this.emergencyCaseRepo.findOne({
      where: { id: caseId },
    });

    if (!emergencyCase) {
      throw new NotFoundException("Emergency case not found");
    }

    if (["completed", "cancelled"].includes(emergencyCase.status)) {
      throw new ConflictException({
        message: `Case is already ${emergencyCase.status}`,
      });
    }

    emergencyCase.status = "cancelled";
    emergencyCase.assignedTo = null;

    // Save the case first
    await this.emergencyCaseRepo.save(emergencyCase);

    // Cancel all related notifications automatically
    await this.notificationService.cancelNotificationsByCaseId(caseId);

    return emergencyCase;
  }
}
