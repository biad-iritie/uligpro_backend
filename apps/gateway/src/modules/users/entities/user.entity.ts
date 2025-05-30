import { ObjectType, Field, Directive, ID } from '@nestjs/graphql';
import { Role } from './role.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields:"id")')
export class User {
  @Field(() => ID)
  @Directive('@external')
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
  confirmed: boolean;

  @Field()
  roleId?: string;

  @Field(() => Role)
  role?: Role;
}
