import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorTypeUser {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}
@ObjectType()
export class RegisterResponse {
  /* @Field()
  activation_token: string; */
  @Field()
  activationToken: string;

  @Field(() => ErrorTypeUser, { nullable: true })
  error?: ErrorTypeUser;
}

@ObjectType()
export class ActivationResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => User, { nullable: true })
  user?: User | any;

  @Field(() => ErrorTypeUser, { nullable: true })
  error?: ErrorTypeUser;
}

@ObjectType()
export class LoginResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => User, { nullable: true })
  user?: User | any;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => ErrorTypeUser, { nullable: true })
  error?: ErrorTypeUser;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;
}
