import 'dotenv/config';

export const Environment = {
  mongodb: {
    url: process.env.MONGO_URL || '',
  },
  email: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
  },
};
