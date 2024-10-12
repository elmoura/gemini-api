import { AuthGuard } from '@modules/auth/auth.guard';
import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { UploadFilesUseCase } from './usecases/upload-files-usecase';
import { UploadFilesOutput } from './usecases/dto/upload-files-output';

@Controller()
export class FilesController {
  constructor(private uploadFilesUseCase: UploadFilesUseCase) {}

  @Get('/')
  check() {
    return { success: true };
  }

  @Post('/files')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMany(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: CurrentUserData,
  ): Promise<UploadFilesOutput> {
    return this.uploadFilesUseCase.execute({
      organizationId: user.organizationId,
      files,
    });
  }
}
