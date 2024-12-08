import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async createUser(
    name: string, 
    mobile: string, 
    password: string, 
    roleName: string,
    schoolId?: number,
    studentNumber?: string
  ) {
    const existingUser = await this.userRepository.findOne({ 
      where: { mobile } 
    });

    if (existingUser) {
      throw new ConflictException('手机号已被注册');
    }

    const role = await this.roleRepository.findOne({ 
      where: { name: roleName } 
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      mobile,
      password: hashedPassword,
      role,
      studentNumber
    });

    return this.userRepository.save(user);
  }

  async validateUser(mobile: string, password: string) {
    const user = await this.userRepository.findOne({ 
      where: { mobile },
      relations: ['role'] 
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['role', 'school'] 
    });
  }
}