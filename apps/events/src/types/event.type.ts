import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';
import { Ticket } from '../entities/ticket.entity';
import { Ticket_categoryOnEvent } from '../entities/ticket_categoryOnEvent';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}
@ObjectType()
export class FindAllResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => [Event], { nullable: true })
  events?: Event[] | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class EventDetailsResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => [Ticket_categoryOnEvent])
  tickets?: Ticket_categoryOnEvent[] | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class TicketsResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => [Ticket], { nullable: true })
  tickets?: Ticket[] | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class BuyTicketsResponse {
  /* @Field()
  activation_token: string; */

  @Field()
  message: string;
}

@ObjectType()
export class TicketScannedResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => Boolean)
  status: boolean;
  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class BasicResponse {
  /* @Field()
  activation_token: string; */

  @Field()
  message: string;
}

@ObjectType()
export class Fee {
  @Field()
  currency: string;
  @Field()
  id: string;
  @Field()
  label: string;
  @Field()
  rate: number;
  @Field()
  rateType: string;
  @Field()
  amount: number;
}
@ObjectType()
export class Payment {
  @Field()
  id: string;
  @Field()
  intentId: string;
  @Field()
  createdAt: string;
  @Field()
  updatedAt: string;
  @Field()
  amount: number;
  @Field()
  currency: string;
  @Field()
  status: string;
  @Field()
  method: string;
  @Field()
  country: string;
  @Field()
  provider: string;
  @Field()
  number: string;
  @Field(() => [Fee])
  fees?: Fee[];
}
@ObjectType()
export class PaymentIntent {
  @Field()
  id: string;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
  @Field()
  merchantId: string;
  @Field()
  purchaseReference: string;
  @Field()
  customerReference: string;
  @Field()
  amount: number;
  @Field()
  currency: string;
  @Field()
  token: string;
  @Field()
  status: string;
  @Field(() => [Payment])
  payments?: Payment[];
  @Field()
  mode: string;
}
