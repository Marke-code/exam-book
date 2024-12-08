import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { RoleModule } from '../role/role.module';
import { Role } from '../role/role.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    RoleModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
