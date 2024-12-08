// import { Command } from 'nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../modules/user/user.entity';
import { Role } from '../modules/role/role.entity';
import { UserRole } from '../modules/role/role.enum';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable() 
export class CreateAdminCommand {
  constructor(private dataSource: DataSource) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 创建系统管理员角色
      const roleRepository = queryRunner.manager.getRepository(Role);
      const adminRole = await roleRepository.save({
        name: UserRole.SYSTEM_ADMIN,
        description: '系统管理员'
      });

      // 创建管理员用户
      const userRepository = queryRunner.manager.getRepository(User);
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await userRepository.save({
        mobile: '13121361262',
        password: hashedPassword,
        role: adminRole
      });

      await queryRunner.commitTransaction();
      console.log('初始管理员创建成功！');
      console.log('手机号：13800138000');
      console.log('密码：admin123');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('创建失败：', err);
    } finally {
      await queryRunner.release();
    }
  }
}