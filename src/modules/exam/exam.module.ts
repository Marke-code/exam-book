import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { User } from '../user/user.entity';
import { Question } from '../question/question.entity';
import { School } from '../school/school.entity';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { UserModule } from '../user/user.module';
import { QuestionModule } from '../question/question.module';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, User, Question, School]),
    UserModule,
    QuestionModule,
    SchoolModule
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService]
})
export class ExamModule {}