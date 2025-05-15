import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  getStatus() {
    return { status: 'Auth service is running' };
  }
}
