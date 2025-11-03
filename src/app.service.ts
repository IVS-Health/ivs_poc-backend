import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class OpenCaseService {
  getmessage(): string {
    return 'New Case Is Registered';
  }
}
