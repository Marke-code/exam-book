import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from'typeorm';
import { Score } from './score.entity';
import { Exam } from '../exam/exam.entity';
import { User } from '../user/user.entity';
import { Question } from '../question/question.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>
  ) {}

  async calculateScore(
    examId: number, 
    studentId: number, 
    studentAnswers: { questionId: number; answer: any }[]
  ) {
    const exam = await this.examRepository.findOne({ 
      where: { id: examId },
      relations: ['questions'] 
    });
    const student = await this.userRepository.findOne({ where: { id: studentId } });

    if (!exam || !student) {
      throw new NotFoundException('Exam or Student not found');
    }

    let totalScore = 0;
    const detailedScores = [];

    for (const studentAnswer of studentAnswers) {
      const question = exam.questions.find(q => q.id === studentAnswer.questionId);
      
      if (!question) continue;

      const isCorrect = this.checkAnswer(question, studentAnswer.answer);
      const score = isCorrect ? 10 : 0; // 每题10分

      totalScore += score;
      detailedScores.push({
        questionId: studentAnswer.questionId,
        score
      });
    }

    const score = this.scoreRepository.create({
      exam,
      student,
      answers: studentAnswers,
      totalScore,
      detailedScores
    });

    return this.scoreRepository.save(score);
  }

  private checkAnswer(question: Question, studentAnswer: any): boolean {
    switch (question.type) {
      case 'single_choice':
        return studentAnswer === question.correctAnswer;
      case 'multiple_choice':
        return JSON.stringify(studentAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());
      case 'true_false':
        return studentAnswer === question.correctAnswer;
      case 'short_answer':
        return studentAnswer.trim() === question.correctAnswer.trim();
      default:
        return false;
    }
  }

  async getStudentScores(studentId: number) {
    return this.scoreRepository.find({ 
      where: { student: { id: studentId } },
      relations: ['exam'] 
    });
  }

  async getExamScores(examId: number) {
    return this.scoreRepository.find({ 
      where: { exam: { id: examId } },
      relations: ['student'] 
    });
  }

  async getClassScoreStatistics(schoolId: number, startDate?: Date, endDate?: Date) {
    const queryBuilder = this.scoreRepository
      .createQueryBuilder('score')
      .innerJoinAndSelect('score.student', 'student')
      .innerJoinAndSelect('score.exam', 'exam')
      .where('student.school.id = :schoolId', { schoolId });

    if (startDate && endDate) {
      queryBuilder.andWhere('exam.startTime BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const scores = await queryBuilder.getMany();

    const statistics = {
      totalStudents: new Set(scores.map(s => s.student.id)).size,
      averageScore: scores.reduce((sum, score) => sum + score.totalScore, 0) / scores.length,
      highestScore: Math.max(...scores.map(s => s.totalScore)),
      lowestScore: Math.min(...scores.map(s => s.totalScore)),
      scoreDistribution: this.calculateScoreDistribution(scores)
    };

    return statistics;
  }

  private calculateScoreDistribution(scores: Score[]) {
    const ranges = [
      { min: 0, max: 60, label: '不及格' },
      { min: 60, max: 70, label: '及格' },
      { min: 70, max: 80, label: '良好' },
      { min: 80, max: 90, label: '优秀' },
      { min: 90, max: 100, label: '卓越' }
    ];

    return ranges.map(range => ({
      ...range,
      count: scores.filter(s => 
        s.totalScore >= range.min && s.totalScore < range.max
      ).length
    }));
  }
}