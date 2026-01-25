import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { EmergencyCaseService } from "./emergencyCase.service";
import { EmergencyCaseDto } from "./dto/emergencyCase.dto";

@Controller("emergency-cases")
export class EmergencyCaseController {
  constructor(private readonly emergencyCaseService: EmergencyCaseService) {}

  @Post("newCase")
  async registerNewCase(@Body() emergencyCaseDto: EmergencyCaseDto) {
    const newCase =
      await this.emergencyCaseService.registerNewCase(emergencyCaseDto);
    return { message: "Case registered successfully", case: newCase };
  }

  @Get("allCases")
  async findAllCases() {
    const cases = await this.emergencyCaseService.findAllCases();
    return { cases };
  }

  @Get("case/:id")
  async findCase(@Param("id", ParseIntPipe) caseId: number) {
    const emergencyCase =
      await this.emergencyCaseService.findEmergencyCase(caseId);
    return emergencyCase;
  }

  @Put("cancelCase")
  async cancelCase(@Body("caseId", ParseIntPipe) caseId: number) {
    const emergencyCase = await this.emergencyCaseService.cancelCase(
      Number(caseId)
    );
    return {
      message: `Case ${emergencyCase.id} closed and all notifications cancelled`,
      case: emergencyCase,
    };
  }
}
