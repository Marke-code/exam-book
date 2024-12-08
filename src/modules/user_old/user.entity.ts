import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @Column({ nullable: true })
  schoolId?: string;

  @Column({ default: new Date() })
  createdAt: Date;
}