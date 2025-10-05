
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePassword } from 'src/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {  
    const user = await this.usersService.findByEmail(username);
    const isValid = await comparePassword(pass, user.password)

    if (!isValid || !user) return null;
    

    return user;
  }

  async login(user: any) { 
    const payload = { sub: user._id, username: user.email };
    return {  
      access_token:  await this.jwtService.signAsync(payload),
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    return await this.usersService.register(createAuthDto);
  }
}
