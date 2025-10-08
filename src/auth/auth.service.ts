
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePassword } from 'src/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAuthDto} from './dto/verify-auth.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // check login information
  async validateUser(username: string, pass: string): Promise<any> {  
    const user = await this.usersService.findOne(username);
    const isValid = await comparePassword(pass, user?.password)

    if (!isValid || !user) return null;
    return user;
  }

  // login and return access token
  async login(user: any) { 
    const payload = { sub: user._id, username: user.email, role: user.role };
    return {  
      access_token:  await this.jwtService.signAsync(payload),
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    return await this.usersService.register(createAuthDto);
  }

  async verify(verifyDto: VerifyAuthDto) {
    return await this.usersService.verify(verifyDto);
  }

  // resend activate code to act
  async resendCode(email: string) {
    return await this.usersService.resendCode(email)
  }
}
