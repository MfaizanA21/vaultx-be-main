import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('create')
  async createEmployee(@Body() dto: CreateEmployeeDto) {
    return await this.employeeService.createEmployeeProfile(dto);
  }
  @Get('all')
  async getAllEmployees() {
    return await this.employeeService.getAllEmployees();
  }

  @Get('profile/:employeeId')
  async getEmployeeProfile(@Param('employeeId') employeeId: string) {
    return await this.employeeService.getEmployeeById(employeeId);
  }
}
