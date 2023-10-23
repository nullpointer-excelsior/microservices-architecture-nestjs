import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    SharedModule,
    PlayerModule
  ],
})
export class PlayerMsModule {}
