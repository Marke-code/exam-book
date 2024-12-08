import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { School } from '../school/school.entity';

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer'
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column('enum', { enum: QuestionType })
  type: QuestionType;

  @Column('simple-json')
  options: string[];

  @Column('simple-json')
  correctAnswer: any;

  @Column({ default: true })
  isShared: boolean;

  @ManyToOne(() => School, { nullable: true })
  originSchool?: School;
}