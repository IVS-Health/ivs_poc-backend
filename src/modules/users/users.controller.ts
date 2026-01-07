import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, LoginDto } from "./dto/user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get("find")
  async findByEmail(@Query("email") email: LoginDto["email"]) {
    return this.usersService.findByEmail(email);
  }
}
