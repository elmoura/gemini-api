import 'dotenv/config';

export const Environment = {
  mongodb: {
    url: process.env.MONGO_URL,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  crypt: {
    secretKey: process.env.CRYPT_SECRET_KEY,
    initializationVector: process.env.CRYPT_IV,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3: {
      region: process.env.S3_IMAGES_BUCKET_REGION,
      bucketName: process.env.S3_IMAGES_BUCKET_NAME,
    },
  },
};
