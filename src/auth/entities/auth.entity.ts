import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn()
  userid: string;

  @BeforeInsert()
  generateUserId() {
    this.userid = 'usr_' + uuidv4().replace(/-/g, '');
  }

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstname?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({
    nullable: true,
    length: 15,
  })
  cnic?: string; // e.g., "12345-1234567-1"

  @Column({ default: false, nullable: true })
  isVerified?: boolean;

  @Column({ default: false, nullable: true })
  isBlocked?: boolean;

  @CreateDateColumn({ default: () => 'GETDATE()' }) // for MSSQL
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'GETDATE()' }) // for MSSQL
  updatedAt: Date;
}
