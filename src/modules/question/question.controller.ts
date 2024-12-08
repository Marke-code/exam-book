import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionType } from './question.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createQuestion(@Body() createQuestionDto: {
    content: string;
    type: QuestionType;
    options: string[];
    correctAnswer: any;
    schoolId?: number;
    isShared?: boolean;
  }) {
    return this.questionService.createQuestion(
      createQuestionDto.content,
      createQuestionDto.type,
      createQuestionDto.options,
      createQuestionDto.correctAnswer,
      createQuestionDto.schoolId,
      createQuestionDto.isShared
    );
  }

  @Get('shared')
  @UseGuards(JwtAuthGuard)
  async getSharedQuestions() {
    return this.questionService.findSharedQuestions();
  }
}