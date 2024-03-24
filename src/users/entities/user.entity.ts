import { Exclude } from 'class-transformer';
// import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;
  select: false;

  @Column({
    type: 'enum',
    enum: ['Business', 'Analytics', 'Developer', 'SME', 'Vendor', 'Admin'],
  })
  role: string;

  @Column({ type: 'varchar' })
  companyid: string;

  @Column({ type: 'varchar', nullable: true })
  country: string;

  @Column({ type: 'varchar' })
  createdby: string;

  @Column({ type: 'varchar' })
  updatedby: string;

  @Column({ type: 'varchar' })
  createddate: string;

  @Column({ type: 'varchar' })
  updateddate: string;

  @Column({ type: 'enum', enum: ['en', 'hn', 'de'] })
  preferedlan: string;

  @Column({ type: 'boolean' })
  isactive: boolean;
}
