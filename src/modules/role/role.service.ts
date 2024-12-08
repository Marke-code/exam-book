import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async createRole(name: string, permissions: string[]) {
    const role = this.roleRepository.create({ name, permissions });
    return this.roleRepository.save(role);
  }

  async findRoleByName(name: string) {
    return this.roleRepository.findOne({ where: { name } });
  }
}