import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AllowWaitingActivation } from '../auth/decorator/allow-waiting-activation.decorator';
import { AuthenticatedRequest } from '../auth/entity/authenticated-request';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PatchUserProfileDto } from './dto/patch-user-profile.dto';
import { PatchUserServiceDto } from './dto/patch-user.service.dto';
import { User } from './model/user.model';
import { UserService } from './user.service';

interface ActiveUserControllerMethodReturn {
  users?: User[];
}

@Controller('user')
export class ActiveUserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Patch(':userId/profile')
  @UseGuards(JwtAuthGuard)
  @AllowWaitingActivation()
  async patchProfile(
    @Req() req: AuthenticatedRequest,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: PatchUserProfileDto
  ): Promise<ActiveUserControllerMethodReturn> {
    const patchUserServiceDto: PatchUserServiceDto = {
      profile: dto.toServiceDto(),
    };
    const user = await this.userService.patchOne(userId, patchUserServiceDto);
    return { users: [user] };
  }
}
