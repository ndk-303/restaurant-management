import { Controller, Get, Post, Body, Patch, Request, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/auth/passport/local-auth.guard';
import { Public } from 'src/decorator/public.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailerService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Public()
  @Post('verify')
  verify(@Body() verifyDto: VerifyAuthDto) {
    return this.authService.verify(verifyDto); 
  }

  @Public()
  @Post('resend-code')
  resendCode(@Body('email') email: string) {
    return this.authService.resendCode(email); 
  }
  
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
