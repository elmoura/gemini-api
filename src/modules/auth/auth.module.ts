import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { TokenService } from './services/token.service';

@Module({
  providers: [AuthGuard, TokenService],
  exports: [AuthGuard, TokenService],
})
export class AuthModule {}
