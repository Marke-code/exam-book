import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ScoreService } from './score.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('scores')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Post('calculate')
  @UseGuards(JwtAuthGuard)
  async calculateScore(@Body() scoreDto: {
    examId: number,
    studentId: number,
    answers: { questionId: number; answer: any }[]
  }) {
    return this.scoreService.calculateScore(
      scoreDto.examId,
      scoreDto.studentId,
      scoreDto.answers
    );
  }

  @Get('student/:studentId')
  @UseGuards(JwtAuthGuard)
  async getStudentScores(@Param('studentId') studentId: number) {
    return this.scoreService.getStudentScores(studentId);
  }

  @Get('exam/:examId')
  @UseGuards(JwtAuthGuard)
  async getExamScores(@Param('examId') examId: number) {
    return this.scoreService.getExamScores(examId);
  }

  @Get('class/:schoolId')
  @UseGuards(JwtAuthGuard)
  async getClassScoreStatistics(
    @Param('schoolId') schoolId: number,
    @Body('startDate') startDate?: Date,
    @Body('endDate') endDate?: Date
  ) {
    return this.scoreService.getClassScoreStatistics(schoolId, startDate, endDate);
  }
}