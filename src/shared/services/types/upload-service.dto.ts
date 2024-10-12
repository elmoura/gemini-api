export type UploadFileParams = {
  key: string;
  bucket: string;
  file: Express.Multer.File;
};

export type UploadFileResult = {
  bucket: string;
  key: string;
  url: string;
};

export type MoveFileParams = {
  fromBucket: string;
  toBucket: string;
  fromKey: string;
  toKey: string;
};

export type MoveFileResult = {
  newFileKey: string;
  newUrl: string;
};
