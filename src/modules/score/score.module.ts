import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { Exam } from '../exam/exam.entity';
import { User } from '../user/user.entity';
import { Question } from '../question/question.entity';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { ExamModule } from '../exam/exam.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score, Exam, User, Question]),
    ExamModule,
    UserModule
  ],
  controllers: [ScoreController],
  providers: [ScoreService],
  exports: [ScoreService]
})
export class ScoreModule {}