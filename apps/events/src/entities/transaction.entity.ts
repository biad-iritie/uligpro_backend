import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Ticket } from './ticket.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class Transaction {
  @Field(() => ID)
  id: number;

  @Field()
  code: string;

  @Field()
  amount: number;

  @Field()
  debitNumber: string;

  @Field()
  way: string;

  @Field()
  didAt: Date;

  @Field(() => [Ticket])
  tickets?: Ticket[];
}
