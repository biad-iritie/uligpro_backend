import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ActivationDto,
  CreateRegularUserInput,
  CreateUserInput,
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
  role?: string;
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
    const { name, email, password, tel, confirmed } = createRegularUserInput;
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
    const code = Math.floor(10000 + Math.random() * 9000).toString();

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

    const { name, email, password, tel, confirmed } = newUser.user;
    const existUser = await this.existUser(email, tel);
    if (existUser) {
      throw new BadRequestException('Cet utlisateur existe déjà! ');
    }

    try {
      const userCreated = await this.prisma.user.create({
        data: {
          name,
          email,
          password,
          tel,
          confirmed,
          role: {
            connect: {
              name: 'REGULAR',
            },
          },
        },
        include: { role: true },
      });
      const tokenSender = new SendToken(this.configService, this.jwtService);
      return tokenSender.sendToken(userCreated);
    } catch (error) {
      throw new BadRequestException(
        'Erreur survenue lors de la creation du compte, SVP reessayez plus tard',
      );

      /* return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message:
            'Erreur survenue lors de la creation du compte, SVP recréer votre compte',
        },
      }; */
    }
  }

  async createUser(user: CreateUserInput) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 15);
      await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          tel: user.tel,
          confirmed: true,
          role: {
            connect: {
              name: user.roleName,
            },
          },
        },
      });
      return 'User created';
    } catch (error) {
      //console.log(error);

      return 'User not created';
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          role: true,
        },
      });
      //console.log(user);

      if (user && (await this.comparePassword(password, user.password))) {
        const tokenSender = new SendToken(this.configService, this.jwtService);
        ////console.log(user);

        return tokenSender.sendToken(user);
      } else {
        return {
          user: null,
          accessToken: null,
          refreshToken: null,
          error: { message: 'Email ou mot de passe invalide' },
        };
      }
    } catch (error) {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: { message: 'Error de connexion niveau serveur, re-essayer SVP' },
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
    //console.log(req.user);

    const user = req.user;
    const accessToken = req.accesstoken;
    const refreshToken = req.refreshtoken;
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
