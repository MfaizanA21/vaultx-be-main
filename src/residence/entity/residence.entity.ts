import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

@Entity('residences')
export class Residence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user: User;

  @Column({ nullable: true })
  addressLine1?: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ type: 'varchar', length: 20, default: 'owned' })
  residenceType: string; // 'owned' or 'rented'

  @Column({ type: 'varchar', length: 20, default: 'flat' })
  residence: string; // 'flat', 'apartment', etc.

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: false })
  isApprovedBySociety: boolean;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ nullable: true, type: 'datetime' })
  approvedAt?: Date;

  @Column({ nullable: true })
  societyName?: string;

  @Column({ nullable: true })
  buildingName?: string;

  @Column({ nullable: true })
  flatNumber?: string;

  @Column({ nullable: true })
  block?: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  updatedAt: Date;
}
