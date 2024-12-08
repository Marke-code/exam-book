import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user_old/user.service';
import { User } from '../user_old/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(phone: string, password: string): Promise<User | null> {
    const user = await this.userService.findByPhone(phone);
    if (user && await this.userService.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { 
      phone: user.phone, 
      sub: user.id, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        role: user.role
      }
    };
  }

  // 验证 JWT token
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}