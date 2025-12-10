import { Body, Controller, Get, Post } from "@nestjs/common";
import { TokenRegistrationDto } from "./dto/token.dto";
import { TokenService } from "./token.service";

@Controller("tokens")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  async saveToken(@Body() tokenDto: TokenRegistrationDto) {
    return this.tokenService.saveToken(tokenDto);
  }

  @Get()
  async getTokens(userId: number) {
    return this.tokenService.getTokenByUserId(userId);
  }
}
