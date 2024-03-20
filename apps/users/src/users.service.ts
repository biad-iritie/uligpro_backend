import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ActivationDto,
  CreateRegularUserInput,
  LoginDto,
} from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { SendToken } from './utlis/sendToken';

interface userData {
  name: string;
  email: string;
  password: string;
  tel: string;
  confirmed: boolean;
  roleId: string;
}

@Injectable()
export class UsersService {
  //private readonly users: User[] = [];
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async createRegularUser(
    createRegularUserInput: CreateRegularUserInput,
    response: Response,
  ) {
    const { name, email, password, tel, confirmed, roleId } =
      createRegularUserInput;
    const existUser = await this.existUser(email, tel);
    if (existUser) {
      throw new BadRequestException('Cet utlisateur existe déjà! ');
    }
    const hashedPassword = await bcrypt.hash(password, 15);

    const user = {
      name,
      email,
      password: hashedPassword,
      tel,
      confirmed,
      roleId,
    };

    const activation = await this.createActivationToken(user);

    const activationCode = activation.code;
    const activationToken = activation.token;

    this.emailService.sendMail({
      email,
      subject: 'Active ton compte ULigPro',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activationToken, response };
  }
  async existUser(email: string, tel: string) {
    const result = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            tel,
          },
        ],
      },
    });
    return result;
  }
  //create activation token
  async createActivationToken(user: userData) {
    const code = Math.floor(100 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        code,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('DURATION_JWT_SECRET'),
      },
    );

    return { token, code };
  }

  // Activation User
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: userData; code: string } = this.jwtService.verify(
      activationToken,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      } as JwtVerifyOptions,
    ) as { user: userData; code: string };

    if (newUser.code !== activationCode) {
      throw new BadRequestException('Le code est incorrect');
    }

    const { name, email, password, tel, confirmed, roleId } = newUser.user;
    const existUser = await this.existUser(email, tel);
    if (existUser) {
      throw new BadRequestException('Cet utlisateur existe déjà! ');
    }

    const user = this.prisma.user.create({
      data: { name, email, password, tel, confirmed, roleId },
    });

    return { user, response };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new SendToken(this.configService, this.jwtService);
      //console.log(user);

      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: { message: 'Email ou mot de passe invalide' },
      };
    }
  }

  async logout(req: any) {
    req.user = null;
    req.refreshToken = null;
    req.accessToken = null;

    return { message: 'Logout successfully!' };
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
  //GET LOGGED IN USER
  async getLoggedInUser(req: any) {
    const user = req.user;
    const accessToken = req.accessToken;
    const refreshToken = req.refreshToken;
    return { user, accessToken, refreshToken };
  }

  findAll() {
    return this.prisma.user.findMany({});
  }

  findOne(id: String) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
