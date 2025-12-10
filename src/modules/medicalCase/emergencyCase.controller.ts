import { Body, Controller, Get, Post } from "@nestjs/common";
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
}
