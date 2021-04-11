import type { Response } from 'express';
import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '../user/model/user.model';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './entity/authenticated-request';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleOauth(): void {
    /* pass */
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleOauthRedirect(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<User> {
    const { user } = req;
    await this.authService.signAuthCookies(user, res.cookie.bind(res));
    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: AuthenticatedRequest): Promise<User> {
    const { user } = req;
    return user;
  }

  @Delete('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(@Res({ passthrough: true }) res: Response): Promise<void> {
    this.authService.clearAuthCookies(res.cookie.bind(res));
  }
}
