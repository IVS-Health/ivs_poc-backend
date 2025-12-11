import { IsNumber, IsString } from "class-validator";

export class TokenRegistrationDto {
  @IsString()
  token: string;

  @IsNumber()
  userId: number;
}
