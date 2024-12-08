import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // 检查手机号是否已存在
    const existingUser = await this.userRepository.findOne({ 
      where: { phone: createUserDto.phone } 
    });

    if (existingUser) {
      throw new ConflictException('手机号已被注册');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.phone = createUserDto.phone;
    user.role = createUserDto.role;
    user.schoolId = createUserDto.schoolId;
    user.createdAt = new Date();

    // 密码加密
    const saltRounds = 10;
    user.password = await bcrypt.hash(createUserDto.password, saltRounds);

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ 
      where: { phone: loginDto.phone } 
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    // 此处可以后续添加生成 JWT Token 的逻辑
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByPhone(phone: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async comparePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }
}