import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamType } from './exam.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exams')
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExam(@Body() createExamDto: {
    title: string;
    type: ExamType;
    startTime: Date;
    endTime: Date;
    creatorId: number;
    schoolId: number;
    questionIds?: number[];
    participantIds: number[];
  }) {
    if (createExamDto.type === ExamType.FIXED) {
      return this.examService.createExam(
        createExamDto.title,
        createExamDto.type,
        createExamDto.startTime,
        createExamDto.endTime,
        createExamDto.creatorId,
        createExamDto.schoolId,
        createExamDto.questionIds || [],
        createExamDto.participantIds
      );
    } else {
      return this.examService.generateRandomExam(
        createExamDto.title,
        createExamDto.startTime,
        createExamDto.endTime,
        createExamDto.creatorId,
        createExamDto.schoolId,
        createExamDto.questionIds?.[0] || 10, // 默认10道题
        createExamDto.participantIds
      );
    }
  }
}