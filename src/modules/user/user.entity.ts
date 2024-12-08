import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../role/role.entity';
import { School } from '../school/school.entity';
import { Exam } from '../exam/exam.entity';
import { Score } from '../score/score.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  mobile: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  studentNumber?: string;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne(() => School, { nullable: true })
  school?: School;

  @OneToMany(() => Exam, exam => exam.creator)
  examsCreated: Exam[];

  @OneToMany(() => Score, score => score.student)
  scores: Score[];
}