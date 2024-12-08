import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './school.entity';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>
  ) {}

  async createSchool(name: string, code: string) {
    const existingSchool = await this.schoolRepository.findOne({ 
      where: { code } 
    });

    if (existingSchool) {
      throw new ConflictException('学校编码已存在');
    }

    const school = this.schoolRepository.create({ name, code });
    return this.schoolRepository.save(school);
  }

  async findSchoolById(id: number) {
    return this.schoolRepository.findOne({ where: { id } });
  }
}