
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { comparePassword } from 'src/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyEmailDto } from './dto/verify-auth.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}


  async validateUser(username: string, pass: string): Promise<any> {  
    const user = await this.usersService.findByEmail(username);
    const isValid = await comparePassword(pass, user?.password)

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

  async verify(verifyDto: VerifyEmailDto) {
    const {email, codeId} = verifyDto;

    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new BadRequestException('Account created unsuccessfully')
    }
    console.log(user.id)
    if (user.codeId !== codeId) {
      throw new BadRequestException('Code id: Invalid/Expired')
    }
    
    user.isActive = true;
    // this.usersService.update({
    //   _id: user._id.toString(),
    //   ...user;
    // });
  }
}
