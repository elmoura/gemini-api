import { Environment } from '@config/env';
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';

interface ICryptoService {
  encrypt(data: string): string;
  decrypt(encryptedData: string): string;
}

@Injectable()
export class CryptoService implements ICryptoService {
  private algorithm: string;

  private secretKey: string;

  private initializationVector: string;

  constructor() {
    const { secretKey, initializationVector } = Environment.crypt;

    this.algorithm = 'aes-256-ctr';
    this.secretKey = secretKey;
    this.initializationVector = initializationVector;
  }

  public encrypt(text: string): string {
    const cipher = createCipheriv(
      this.algorithm,
      this.secretKey,
      this.initializationVector,
    );

    const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);

    return encryptedData.toString('hex');
  }

  public decrypt(data: string): string {
    const decipher = createDecipheriv(
      this.algorithm,
      this.secretKey,
      this.initializationVector,
    );

    const decryptedData = Buffer.concat([
      decipher.update(Buffer.from(data, 'hex')),
      decipher.final(),
    ]);

    return decryptedData.toString();
  }
}
