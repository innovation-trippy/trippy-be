import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';
import { AuthModule } from 'src/auth/auth.module';
import { KakaoStrategy } from 'src/auth/strategy/kakao.strategy';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
