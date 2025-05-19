export type GetEmployeeProfileDto = {
  employeeId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  cnic?: string;
  internalRole: string;
  department?: string;
  shift?: string;
  joiningDate?: Date;
};
