import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('approve/:residentID')
  async approveUser(residentID: string): Promise<void> {
    return this.adminService.approveUser(residentID);
  }

  @Get('approval/pending')
  async getPendingApprovals(): Promise<any[]> {
    return this.adminService.getPendingApprovals();
  }
}
