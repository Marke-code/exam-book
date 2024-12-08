import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam, ExamType } from './exam.entity';
import { User } from '../user/user.entity';
import { Question } from '../question/question.entity';
import { School } from '../school/school.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>
  ) {}

  async createExam(
    title: string,
    type: ExamType,
    startTime: Date,
    endTime: Date,
    creatorId: number,
    schoolId: number,
    questionIds: number[],
    participantIds: number[]
  ) {
    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
    const school = await this.schoolRepository.findOne({ where: { id: schoolId } });
    const questions = await this.questionRepository.findByIds(questionIds);
    const participants = await this.userRepository.findByIds(participantIds);

    if (!creator || !school) {
      throw new NotFoundException('Creator or School not found');
    }

    const exam = this.examRepository.create({
      title,
      type,
      startTime,
      endTime,
      creator,
      school,
      questions,
      participants
    });

    return this.examRepository.save(exam);
  }

  async generateRandomExam(
    title: string,
    startTime: Date,
    endTime: Date,
    creatorId: number,
    schoolId: number,
    questionCount: number,
    participantIds: number[]
  ) {
    const sharedQuestions = await this.questionRepository.find({ 
      where: { isShared: true } 
    });

    if (sharedQuestions.length < questionCount) {
      throw new NotFoundException('Not enough shared questions');
    }

    const randomQuestions = sharedQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, questionCount);

    return this.createExam(
      title,
      ExamType.RANDOM,
      startTime,
      endTime,
      creatorId,
      schoolId,
      randomQuestions.map(q => q.id),
      participantIds
    );
  }
}