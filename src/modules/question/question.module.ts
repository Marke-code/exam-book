import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { School } from '../school/school.entity';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, School]),
    SchoolModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule {}