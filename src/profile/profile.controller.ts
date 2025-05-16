import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { Logger } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('resident')
@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(private readonly profileService: ProfileService) {}
  @Get('me')
  async getUser(@Req() req: { user: { userid: string } }) {
    const userId = req.user.userid;
    return await this.profileService.getUserProfile(userId);
  }

  @Post('create')
  async createUser(
    @Body() createUserDto: CreateProfileDTO,
    @Req() req: { user: { userid: string } },
  ) {
    const userId = req.user.userid;
    return await this.profileService.createUserProfile(createUserDto, userId);
  }
}
