
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePassword } from 'src/helpers/util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string) {  
    const user = await this.usersService.findByEmail(username);

    if (!user) {
      throw new UnauthorizedException('User doesn not exist') 
    }
    
    const isValid = await comparePassword(pass, user.password)

    if (!isValid) {
      throw new UnauthorizedException('Invalid password')
    }

    return user;
  }

  async login(user: any) { 
    const payload = { sub: user._id, username: user.email };
    return {  
      access_token:  await this.jwtService.signAsync(payload),
    }
  }
}
