import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { User } from './user.entity';
import { Ticket_category } from './ticket_category';
import { Transaction } from './transaction.entity';
@ObjectType()
@Directive('@key(fields:"eventId,transactionId, code")')
export class Ticket {
  @Field()
  eventId: string;

  @Field(() => Event)
  event: Event;

  @Field()
  transactionId: string;

  @Field(() => Transaction)
  transaction: Transaction;

  @Field()
  code: string;

  @Field()
  ticket_categoryId: string;

  @Field(() => Ticket_category)
  ticket_category: Ticket_category;

  @Field()
  scanned: boolean;

  @Field()
  scannedAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  scannedByUserId: string;

  @Field(() => User)
  scannedByUser: User;
}
