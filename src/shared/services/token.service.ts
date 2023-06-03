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

const TOKEN_EXPIRATION_TIME_IN_MS = 24 * 60 * 60 * 1000; // 1 day

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
      accessToken: sign(payload, this.secret, {
        expiresIn: TOKEN_EXPIRATION_TIME_IN_MS,
      }),
    };
  }

  decode(token: string): GenerateTokenPayload & Jwt {
    return decode(token, { json: true }) as GenerateTokenPayload & Jwt;
  }
}
