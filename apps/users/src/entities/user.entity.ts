import { ObjectType, Field, Directive, Int, ID } from '@nestjs/graphql';
import { Role } from './role.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class User {
  @Field(() => ID)
  id: number;

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
  roleId: number;

  @Field(() => Role)
  role?: Role;

  /* @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date; */

  /* @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number; */
}
