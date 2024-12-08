import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schools')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSchool(@Body() createSchoolDto: { name: string; code: string }) {
    return this.schoolService.createSchool(createSchoolDto.name, createSchoolDto.code);
  }
}