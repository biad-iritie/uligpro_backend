import { BadRequestException, Injectable } from '@nestjs/common';
import { ActivationDto, CreateRegularUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';

interface userData {
  name: string;
  email: string;
  password: string;
  tel: string;
  confirmed: boolean;
  roleId: number;
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
            email: email,
          },
          {
            tel: tel,
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
        expiresIn: '60m',
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

  findAll() {
    return this.prisma.user.findMany({});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
