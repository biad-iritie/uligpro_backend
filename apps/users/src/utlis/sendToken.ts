import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
//import { User } from '../entities/user.entity';

export class SendToken {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  public sendToken(user) {
    ////console.log(this.config.get<string>('ACCESS_TOKEN_SECRET'));

    const accessToken = this.jwt.sign(
      {
        roleName: user.role.name,
        id: user.id,
      },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.config.get<string>('DURATION_ACCESS_TOKEN'),
      },
    );
    ////console.log(this.config.get<string>('REFRESH_TOKEN_SECRET'));

    const refreshToken = this.jwt.sign(
      {
        roleName: user.role.name,
        id: user.id,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get<string>('DURATION_REFRESH_TOKEN'),
      },
    );
    console.log(user);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
