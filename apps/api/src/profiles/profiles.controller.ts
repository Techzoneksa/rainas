import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfilesService } from "./profiles.service";

@ApiTags("profiles")
@Controller()
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get("profiles/:username")
  getByUsername(@Param("username") username: string) {
    return this.profiles.getByUsername(username);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Get("me/profile")
  getMine(@CurrentDemoUser() userId: string) {
    return this.profiles.getMine(userId);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Patch("me/profile")
  updateMine(@CurrentDemoUser() userId: string, @Body() dto: UpdateProfileDto) {
    return this.profiles.updateMine(userId, dto);
  }
}
