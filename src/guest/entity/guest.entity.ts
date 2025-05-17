import { Residence } from 'src/residence/entity/residence.entity';
import { Vehicle } from 'src/vehicle/entity/vehicle.entity';
import {
  Entity,
  PrimaryColumn,
  BeforeInsert,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('guests')
export class Guest {
  @PrimaryColumn()
  guestId: string;

  @BeforeInsert()
  generateGuestId() {
    this.guestId = 'guest_' + uuidv4().replace(/-/g, '');
  }

  @Column()
  guestName: string;

  @Column()
  guestPhoneNumber: string;

  @Column({ type: 'datetime' })
  eta: Date;

  @Column({ default: false })
  visitCompleted: boolean;

  @ManyToOne(() => Residence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'residenceId' })
  residence: Residence;

  @OneToOne(() => Vehicle, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vehicleId' })
  guestVehicle?: Vehicle;

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  updatedAt: Date;
}
