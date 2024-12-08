import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}