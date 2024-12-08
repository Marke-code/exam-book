import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(mobile: string, password: string) {
    const user = await this.userService.validateUser(mobile, password);
    if (user) {
      const payload = { 
        id: user.id, 
        mobile: user.mobile, 
        role: user.role.name 
      };
      return {
        access_token: this.jwtService.sign(payload)
      };
    }
    return null;
  }
}