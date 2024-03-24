// import { Exclude } from 'class-transformer';
// import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users-audit')
export class UserAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  userid: string;

  @Column({ type: 'varchar' })
  ipaddress: string;

  @Column({ type: 'varchar' })
  source: string;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'varchar' })
  lastlogin: string;

  @Column({ type: 'varchar' })
  module: string;
}
