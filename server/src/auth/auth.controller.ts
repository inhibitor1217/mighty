import type { Response } from 'express';
import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '../user/model/user.model';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './entity/authenticated-request';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

interface AuthControllerMethodReturn {
  users?: User[];
  deletedUserId?: number;
}

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
  ): Promise<AuthControllerMethodReturn> {
    const { user } = req;

    await this.authService.signAuthCookies(user, res.cookie.bind(res));

    return { users: [user] };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @Req() req: AuthenticatedRequest
  ): Promise<AuthControllerMethodReturn> {
    const { user } = req;

    return { users: [user] };
  }

  @Delete('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthControllerMethodReturn> {
    const { user } = req;

    this.authService.clearAuthCookies(res.cookie.bind(res));

    return { deletedUserId: user.id };
  }
}
