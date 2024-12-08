import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exam } from '../exam/exam.entity';
import { User } from '../user/user.entity';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exam)
  exam: Exam;

  @ManyToOne(() => User)
  student: User;

  @Column('simple-json')
  answers: any[];

  @Column('float')
  totalScore: number;

  @Column('simple-json')
  detailedScores: { questionId: number; score: number }[];
}