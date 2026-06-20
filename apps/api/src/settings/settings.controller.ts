import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { SettingsService } from "./settings.service";

@ApiTags("settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  list() {
    return this.settings.list();
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Patch(":key")
  update(
    @CurrentDemoUser() userId: string,
    @Param("key") key: string,
    @Body() dto: UpdateSettingDto
  ) {
    return this.settings.update(userId, key, dto);
  }
}
