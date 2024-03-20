import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

export class Protect {
  constructor(private readonly config: ConfigService) {}

  async encryptData(data: any) {
    console.log(data);
    const cipher = crypto.createCipheriv(
      this.config.get<string>('ALGORITHM'),
      this.config.get<string>('SECRET_KEY_PROTECT'),
      this.config.get<string>('IV'),
    );

    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64'); // Encrypts data and converts to hex and base64
  }

  async decryptData(encryptedData: string) {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(
      this.config.get<string>('ALGORITHM'),
      this.config.get<string>('SECRET_KEY_PROTECT'),
      this.config.get<string>('IV'),
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ); // Decrypts data and converts to utf8
  }
}
