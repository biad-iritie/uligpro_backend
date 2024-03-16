import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

export class sendToken {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  public sendToken(user: User) {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_EXPIRE'),
        expiresIn: '3d',
      },
    );
    return { user, accessToken, refreshToken };
  }
}
