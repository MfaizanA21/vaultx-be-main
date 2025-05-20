import { Controller, Get, Patch,Param, UseGuards } from '@nestjs/common';
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
async approveUser(@Param('residentID') residentID: string): Promise<void> {
  return this.adminService.approveUser(residentID);
}

  @Get('approval/pending')
  async getPendingApprovals(): Promise<any[]> {
    return this.adminService.getPendingApprovals();
  }

@Get('approval/approved')
async getApprovedUsers(): Promise<any[]> {
  return this.adminService.getApprovedUsers();
}

}
