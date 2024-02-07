import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    UsersModule
  ],
})
export class AccountsMsModule {}
