import { ObjectType, Field, Directive, ID } from '@nestjs/graphql';
import { Role } from './role.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  tel: string;

  @Field()
  createdAt: Date;

  @Field()
  confirmed: Boolean;

  @Field()
  roleId?: string;

  @Field(() => Role)
  role?: Role;
}
