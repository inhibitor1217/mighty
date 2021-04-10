import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from './entity/authenticated-request';
import { GoogleOauthGuard } from './guard/google-oauth.guard';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleOauth() {
    /* pass */
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleOauthRedirect(@Req() req: AuthenticatedRequest) {
    const { user } = req;

    return user;
  }
}
