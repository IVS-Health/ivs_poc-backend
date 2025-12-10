import { IsNotEmpty, IsString } from "class-validator";

export class EmergencyCaseDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  callBackNumber: string;

  @IsString()
  natureOfEmergency: string;

  @IsString()
  patientCondition: string;
}
