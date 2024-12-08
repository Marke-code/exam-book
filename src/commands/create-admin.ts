import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../modules/user/user.entity';
import { Role } from '../modules/role/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateAdminCommand {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute() {
    try {
      // 1. 首先确保管理员角色存在
      const adminRole = await this.roleRepository.findOne({ 
        where: { name: 'admin' } 
      });
      
      if (!adminRole) {
        throw new Error('管理员角色不存在，请先创建角色');
      }

      // 2. 检查是否已存在管理员
      const existingAdmin = await this.userRepository.findOne({
        where: { mobile: 'admin' }
      });

      if (existingAdmin) {
        console.log('管理员已存在');
        return;
      }

      // 3. 创建管理员用户
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = this.userRepository.create({
        name: 'Admin',
        mobile: 'admin', // 或者设置一个实际的手机号
        password: hashedPassword,
        role: adminRole,
      });

      await this.userRepository.save(adminUser);
      console.log('管理员创建成功！');
      console.log('用户名：admin');
      console.log('密码：admin123');
    } catch (error) {
      console.error('创建管理员失败:', error);
      throw error;
    }
  }
}