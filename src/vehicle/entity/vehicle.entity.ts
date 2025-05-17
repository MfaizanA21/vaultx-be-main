import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Residence } from 'src/residence/entity/residence.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryColumn()
  vehicleId: string;

  @BeforeInsert()
  generateVehicleId() {
    this.vehicleId = 'veh_' + uuidv4().replace(/-/g, '');
  }

  @Column()
  vehicleType: string;

  @Column()
  vehicleModel: string;

  @Column()
  vehicleName: string;

  @Column()
  vehicleLicensePlateNumber: string;

  @Column()
  vehicleRFIDTagId: string;

  @Column({ nullable: false })
  vehicleColor: string;

  @Column({ default: false })
  isGuest: boolean;

  // 🧑 Resident Owner
  @ManyToOne(() => Residence, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'residentid' })
  residentOwner?: Residence;

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  updatedAt: Date;
}
