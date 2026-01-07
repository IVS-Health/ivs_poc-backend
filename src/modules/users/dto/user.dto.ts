import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  medicalSpecialty: string;
}

export class LoginDto {
  @IsEmail()
  email: string;
}
