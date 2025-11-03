import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenCaseService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly openCaseService: OpenCaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('openCase')
  getmessage(): string {
    return this.openCaseService.getmessage();
  }
}
