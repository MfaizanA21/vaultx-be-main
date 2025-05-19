import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { DataSource, Repository } from 'typeorm';
import { Employee } from './entity/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { GetEmployeeProfileDto } from './dto/get-profile.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createEmployeeProfile(dto: CreateEmployeeDto): Promise<void> {
    const {
      email,
      cnic,
      password,
      firstname,
      lastname,
      phone,
      internalRole,
      department,
      shift,
      joiningDate,
    } = dto;

    const existingUser = await this.userRepository.findOne({
      where: cnic ? [{ email }, { cnic }] : [{ email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or CNIC already exists.',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.dataSource.transaction(async (manager) => {
      const user = manager.getRepository(User).create({
        email,
        password: hashedPassword,
        firstname,
        lastname,
        phone,
        cnic,
        role: 'employee',
      });

      const savedUser = await manager.getRepository(User).save(user);

      const employee = manager.getRepository(Employee).create({
        user: savedUser,
        internalRole,
        department,
        shift,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      });

      await manager.getRepository(Employee).save(employee);
    });
  }

  async getEmployeeById(employeeId: string): Promise<GetEmployeeProfileDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found.');
    }

    const { id, internalRole, department, shift, joiningDate, user } = employee;

    return {
      employeeId: id,
      firstname: user.firstname ?? '',
      lastname: user.lastname ?? '',
      email: user.email,
      phone: user.phone,
      cnic: user.cnic,
      internalRole,
      department,
      shift,
      joiningDate,
    };
  }

  async getAllEmployees(): Promise<GetEmployeeProfileDto[]> {
    const employees = await this.employeeRepository.find({
      relations: ['user'],
    });

    if (!employees || employees.length === 0) {
      throw new NotFoundException('No employees found.');
    }

    return employees.map((employee) => {
      const { id, internalRole, department, shift, joiningDate, user } =
        employee;

      return {
        employeeId: id,
        firstname: user.firstname ?? '',
        lastname: user.lastname ?? '',
        email: user.email,
        phone: user.phone,
        cnic: user.cnic,
        internalRole,
        department,
        shift,
        joiningDate,
      };
    });
  }
}
