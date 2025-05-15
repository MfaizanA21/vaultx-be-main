import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SigninDTO } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
  @Post('signup')
  async signup(@Body() signupDto: SignUpDto): Promise<any> {
    this.logger.log(`Received signup request: ${JSON.stringify(signupDto)}`);
    return await this.authService.createUser(signupDto);
  }

  @Post('login')
  async login(@Body() dto: SigninDTO) {
    return this.authService.login(dto);
  }
}
