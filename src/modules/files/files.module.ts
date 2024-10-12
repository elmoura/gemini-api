import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { UploadService } from '@shared/services/upload.service';
import { UploadFilesUseCase } from './usecases/upload-files-usecase';
import { FilesController } from './files.controller';

@Module({
  imports: [AuthModule],
  providers: [UploadService, UploadFilesUseCase],
  controllers: [FilesController],
})
export class FilesModule {}
