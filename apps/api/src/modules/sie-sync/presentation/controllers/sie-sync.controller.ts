import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { TriggerSieSyncUseCase } from '../../application/use-cases/trigger-sync.use-case';
import { TriggerSieSyncDto } from '../../application/dto/trigger-sync.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { UserRole, AuthenticatedUser } from '@academic/shared-types';
import { PrismaService } from '../../../../common/database/prisma.service';

@Controller('sie-sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SieSyncController {
  constructor(
    private readonly triggerSyncUseCase: TriggerSieSyncUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Post('trigger')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  async triggerSync(
    @Body() dto: TriggerSieSyncDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.triggerSyncUseCase.execute(dto, user.id);
    return {
      statusCode: 202,
      message: 'Sincronización con el SIE iniciada de forma asíncrona',
      data: result,
    };
  }

  @Get('status/:id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  async getSyncStatus(@Param('id') id: string) {
    const sync = await this.prisma.sieSynchronization.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return {
      statusCode: 200,
      data: sync,
    };
  }
}
