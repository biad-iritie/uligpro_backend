import { ObjectType, Field, Directive, Int, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields:"id")')
export class Role {
  @Field(() => ID)
  @Directive('@external')
  id: string;

  @Field()
  name: string;

  @Field(() => [User], { nullable: true })
  users?: User[];

  /* @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number; */
}
