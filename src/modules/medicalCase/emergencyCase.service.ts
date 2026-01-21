import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmergencyCase } from "./emergencyCase.entity";
import { EmergencyCaseDto } from "./dto/emergencyCase.dto";

@Injectable()
export class EmergencyCaseService {
  constructor(
    @InjectRepository(EmergencyCase)
    private readonly emergencyCaseRepo: Repository<EmergencyCase>
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
    const cases = await this.emergencyCaseRepo.find();
    if (!cases) {
      throw new NotFoundException(`No casesfound`);
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
}
