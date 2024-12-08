import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import { Role } from '../../modules/role/role.entity';
import { UserRole } from '../../modules/role/role.enum';
import * as bcrypt from 'bcrypt';

export default class CreateInitialAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // 先创建系统管理员角色
    const roleRepository = connection.getRepository(Role);
    const adminRole = await roleRepository.save({
      name: UserRole.SYSTEM_ADMIN,
      description: '系统管理员'
    });

    // 创建管理员用户
    const userRepository = connection.getRepository(User);
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save({
      mobile: '13121361262',
      password: hashedPassword,
      role: adminRole
    });
  }
}