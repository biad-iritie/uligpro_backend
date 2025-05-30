import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '../entities/role.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;

    /* //console.log('canActivate');
    //console.log(accessToken); */

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this ressource!');
    }

    if (accessToken) {
      try {
        const decoded = await this.jwtService.verify(accessToken, {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        } as JwtVerifyOptions);

        if (!decoded) {
          throw new UnauthorizedException('Invalid access token');
        }

        const user = await this.prisma.user.findUnique({
          where: {
            id: decoded.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            tel: true,
            role: true,
          },
        });
        req.accesstoken = accessToken;
        req.refreshtoken = refreshToken;
        req.user = user;
      } catch (error) {
        ////console.log(error);
        await this.updateAccessToken(req);
      }
    }
    return true;
  }

  async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData = req.headers.refreshtoken as string;
      //console.log('updateAccessToken');

      const decoded = this.jwtService.verify(refreshTokenData, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      } as JwtVerifyOptions);
      if (!decoded) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          tel: true,
          role: true,
        },
      });
      const accessToken = this.jwtService.sign(
        { id: user.id, roleName: user.role.name },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.config.get<string>('DURATION_ACCESS_TOKEN'),
        },
      );
      const refreshToken = this.jwtService.sign(
        { id: user.id, roleName: user.role.name },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.config.get<string>('DURATION_REFRESH_TOKEN'),
        },
      );
      req.accesstoken = accessToken;
      req.refreshtoken = refreshToken;
      req.user = user;
    } catch (error) {
      //console.log(error);
      throw new UnauthorizedException('SVP connectez-vous à votre compte!');
    }
  }
}
