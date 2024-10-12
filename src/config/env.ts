import 'dotenv/config';

export const Environment = {
  env: process.env.NODE_ENV,
  mongodb: {
    url: process.env.MONGO_URL || '',
  },
  email: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
  },
  crypt: {
    secretKey: process.env.CRYPT_SECRET_KEY,
    initializationVector: process.env.CRYPT_IV,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
};
