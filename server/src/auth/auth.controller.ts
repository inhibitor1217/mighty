import { Controller, Get, UseGuards } from '@nestjs/common';
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
  async googleOauthRedirect() {
    /* pass */
  }
}
