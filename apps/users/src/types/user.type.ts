import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorType {
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

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => User)
  user?: User | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => User, { nullable: true })
  user?: User | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
