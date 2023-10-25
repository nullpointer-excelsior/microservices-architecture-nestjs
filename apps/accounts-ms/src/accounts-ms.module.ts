import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    AccountsModule
  ],
})
export class AccountsMsModule {}
