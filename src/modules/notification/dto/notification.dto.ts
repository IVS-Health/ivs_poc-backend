import { IsNumber, IsOptional, IsString } from "class-validator";

export class NotificationDto {
  @IsNumber()
  caseId: number;
}

export class UpdateNotificationStatusDto {
  @IsNumber()
  caseId: number;

  @IsString()
  notificationStatus: string;

  @IsNumber()
  tokenId: number;
}
