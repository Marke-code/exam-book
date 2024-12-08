import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Question } from '../question/question.entity';
import { School } from '../school/school.entity';

export enum ExamType {
  FIXED = 'fixed',
  RANDOM = 'random'
}

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('enum', { enum: ExamType })
  type: ExamType;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column('int', { default: 100 })
  totalScore: number;

  @ManyToOne(() => User)
  creator: User;

  @ManyToOne(() => School)
  school: School;

  @ManyToMany(() => Question)
  @JoinTable()
  questions: Question[];

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];
}