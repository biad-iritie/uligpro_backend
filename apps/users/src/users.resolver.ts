import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ActivationDto, CreateRegularUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  ActivationResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
} from './types/user.type';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './guard/auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async registerUser(
    @Args('UserInput')
    createRegularUserInput: CreateRegularUserInput,
    @Context()
    context: { res: Response },
  ): Promise<RegisterResponse> {
    /* if (
      !createRegularUserInput.name ||
      !createRegularUserInput.email ||
      !createRegularUserInput.password ||
      !createRegularUserInput.tel
    ) {
      throw new BadRequestException('Remplis tous les champs, SVP');
    } */
    const { activationToken } = await this.usersService.createRegularUser(
      createRegularUserInput,
      context.res,
    );

    return { activationToken };
  }

  @Mutation(() => LoginResponse)
  async activateUser(
    @Args('activationInput') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    return await this.usersService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.usersService.login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(
    @Context() context: { req: Request },
  ): Promise<LoginResponse> {
    return await this.usersService.getLoggedInUser(context.req);
  }

  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logout(@Context() context: { req: Request }): Promise<LogoutResponse> {
    return await this.usersService.logout(context.req);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: String) {
    return this.usersService.findOne(id);
  }

  /* @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  } */
}
