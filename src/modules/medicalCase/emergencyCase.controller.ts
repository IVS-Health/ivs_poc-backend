import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { EmergencyCaseService } from "./emergencyCase.service";
import { EmergencyCaseDto } from "./dto/emergencyCase.dto";

@Controller("emergency-cases")
export class EmergencyCaseController {
  constructor(private readonly emergencyCaseService: EmergencyCaseService) {}

  @Post("newCase")
  async registerNewCase(@Body() emergencyCaseDto: EmergencyCaseDto) {
    return this.emergencyCaseService.registerNewCase(emergencyCaseDto);
  }
}
