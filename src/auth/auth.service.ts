import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDTO } from './dto/sign-in.dto';

export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async isUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async createUser(signupDto: SignUpDto): Promise<void> {
    const { email, password } = signupDto;
    this.logger.log('Received signup request:', signupDto);
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'Failed to create user. Please try again later.',
      );
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      this.logger.warn(`Invalid credentials for email: ${email}`);
      return null;
    }
  }

  async login(SigninDTO: SigninDTO): Promise<{ token: string }> {
    const { email, password } = SigninDTO;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userid: user.userid,
      name: user.firstname,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
