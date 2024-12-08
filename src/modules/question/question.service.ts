import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType } from './question.entity';
import { School } from '../school/school.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>
  ) {}

  async createQuestion(
    content: string,
    type: QuestionType,
    options: string[],
    correctAnswer: any,
    schoolId?: number,
    isShared: boolean = true
  ) {
    const school = schoolId 
      ? await this.schoolRepository.findOne({ where: { id: schoolId } }) 
      : null;

    const question = this.questionRepository.create({
      content,
      type,
      options,
      correctAnswer,
      originSchool: school,
      isShared
    });

    return this.questionRepository.save(question);
  }

  async findSharedQuestions() {
    return this.questionRepository.find({ 
      where: { isShared: true } 
    });
  }
}