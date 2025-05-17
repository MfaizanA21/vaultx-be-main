import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';

@Entity('societies')
export class Society {
  @PrimaryColumn({ name: 'society_id', type: 'varchar', length: 30 })
  societyId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode?: string;

  @BeforeInsert()
  generateSocietyId() {
    // MSSQL-safe random ID generation
    const randomStr = Math.random().toString(36).substring(2, 12);
    this.societyId = `soc_${randomStr}`;
  }
}
