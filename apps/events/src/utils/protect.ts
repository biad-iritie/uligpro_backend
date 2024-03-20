import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';

export class protect {
  constructor(
    private readonly config: ConfigService,
    private readonly algorithm: string,
    private readonly secretKey: string,
    private readonly iv: string,
  ) {
    this.algorithm = this.config.get<string>('ALGORITHM');
    this.secretKey = this.config.get<string>('SECRET_KEY_PROTECT');
    this.iv = this.config.get<string>('IV');
  }

  async encryptData(data: any) {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64'); // Encrypts data and converts to hex and base64
  }

  async decryptData(encryptedData: string) {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ); // Decrypts data and converts to utf8
  }
}
