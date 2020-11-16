import { Module } from '@nestjs/common';
import { PlayersController } from './players/players.controller';
import { PlayersModule } from './players/players.module';
import { PlayersService } from './players/players.service';

@Module({
  imports: [PlayersModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class AppModule {}
