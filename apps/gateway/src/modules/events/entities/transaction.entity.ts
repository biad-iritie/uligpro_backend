import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Ticket } from './ticket.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class Transaction {
  @Field(() => ID)
  id: string;

  @Field()
  intendId: string;
  @Field({ nullable: true })
  paymentId: string;

  @Field()
  amount: number;

  @Field()
  amountWithFee: number;
  @Field()
  provider: string;
  @Field()
  currency: string;
  @Field()
  country: string;
  @Field()
  method: string;
  @Field()
  intendCreatedAt: Date;
  @Field({ nullable: true })
  paidAt: Date;

  @Field()
  debitNumber: string;

  @Field(() => [Ticket])
  tickets?: Ticket[];
}
