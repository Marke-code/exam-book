import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './school.entity';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
  imports: [TypeOrmModule.forFeature([School])],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [SchoolService]
})
export class SchoolModule {}