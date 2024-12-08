// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { SchoolModule } from './modules/school/school.module';
import { QuestionModule } from './modules/question/question.module';
import { ExamModule } from './modules/exam/exam.module';
import { ScoreModule } from './modules/score/score.module';
import { AuthModule } from './modules/auth/auth.module';
import { CreateAdminCommand } from './commands/create-admin.command';

@Module({
  providers: [CreateAdminCommand],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017/exam_system',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoLoadEntities: true,
      synchronize: false,  // 先设置为 false
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      directConnection: true,
    }),
  UserModule,
  RoleModule,
  SchoolModule,
  QuestionModule,
  ExamModule,
  ScoreModule,
    AuthModule
  ]
})
export class AppModule {}