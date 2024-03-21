import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Ticket } from './ticket.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field((type) => ID)
  @Directive('@external')
  id: string;

  @Field(() => [Ticket])
  tickets?: Ticket[];
}
