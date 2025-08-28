import { Get } from '@nestjs/common';
import { SqliteService } from '../../shared/infrastructure/database/sqlite/database.service';
import { IDiscordRepository } from '../../shared/infrastructure/discord/repositories/i-discord-repository';

export class HealthController {
  constructor(
    private readonly databaseService: SqliteService,
    private readonly discordService: IDiscordRepository,
  ) {}

  @Get('health')
  async checkSystem() {
    try {
      const discordStatus = await this.discordService.healthCheck();
      const databaseStatus = await this.databaseService.healthCheck();

      return {
        status: discordStatus && databaseStatus ? 'ok' : 'error',
        database: 'connected',
        discord: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        discord: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
