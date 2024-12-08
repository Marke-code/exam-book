import { IsNotEmpty, IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(2, 20, { message: '用户名长度必须在2-20个字符之间' })
  username: string;

  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入有效的手机号' })
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password: string;

  @IsEnum(UserRole, { message: '无效的用户角色' })
  role: UserRole;

  @IsOptional()
  schoolId?: string;
}