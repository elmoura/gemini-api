class FileItem {
  key: string;
  url: string;
}

export class UploadFilesOutput {
  success: boolean;
  items: FileItem[];
}
