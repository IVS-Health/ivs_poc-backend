import { IsNumber, IsOptional, IsString } from "class-validator";

export class NotificationDto {
  @IsNumber()
  caseId: number;
}
