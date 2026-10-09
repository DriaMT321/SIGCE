import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AnnouncementsService, CreateAnnouncementInput } from './announcements.service';

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  async list(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.announcementsService.list(user);
    return {
      statusCode: 200,
      message: 'Comunicados obtenidos exitosamente',
      data,
      total: data.length,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAnnouncementInput,
  ) {
    const data = await this.announcementsService.create(user, body);
    return {
      statusCode: 201,
      message: 'Comunicado emitido y notificado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async delete(@Param('id') id: string) {
    await this.announcementsService.delete(id);
    return {
      statusCode: 200,
      message: 'Comunicado eliminado exitosamente',
    };
  }
}
