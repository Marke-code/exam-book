import { IsNotEmpty, IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { UserRole } from '../../role/role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(2, 20, { message: '用户名长度必须在2-20个字符之间' })
  name: string;

  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入有效的手机号' })
  mobile: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password: string;

  @IsEnum(UserRole, { message: '无效的用户角色' })
  role: UserRole;

  @IsOptional()
  @IsNotEmpty({ message: '学校ID不能为空', always: true })
  @Length(1, 50, { message: '学校ID长度必须在1-50个字符之间', always: true })
  schoolId?: number;

  @IsOptional()
  @IsNotEmpty({ message: '学生编号不能为空', always: true })
  @Length(1, 20, { message: '学生编号长度必须在1-20个字符之间', always: true })
  studentNumber?: string;
}