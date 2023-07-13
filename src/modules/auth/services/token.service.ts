import { Environment } from '@config/env';
import { Injectable } from '@nestjs/common';
import { sign, verify, Jwt, decode, JwtPayload } from 'jsonwebtoken';

export interface GenerateTokenPayload {
  userId: string;
  organizationId: string;
}

interface GenerateTokenResult {
  accessToken: string;
}

export type TokenData = GenerateTokenPayload & JwtPayload;

interface ITokenService {
  isTokenValid(token: string): boolean;
  decode(token: string): TokenData;
  generate(params: GenerateTokenPayload): GenerateTokenResult;
}

@Injectable()
export class TokenService implements ITokenService {
  private readonly secret: string;

  constructor() {
    this.secret = Environment.crypt.secretKey;
  }

  isTokenValid(token: string): boolean {
    const decodedToken = verify(token, this.secret);
    return Boolean(decodedToken);
  }

  generate(payload: GenerateTokenPayload): GenerateTokenResult {
    return {
      accessToken: sign(payload, this.secret, { expiresIn: '3 days' }),
    };
  }

  decode(token: string): GenerateTokenPayload & Jwt {
    return decode(token, { json: true }) as GenerateTokenPayload & Jwt;
  }
}
