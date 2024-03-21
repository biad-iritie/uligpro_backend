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
  @Field(() => [Ticket])
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
export class TestResponse {
  /* @Field()
  activation_token: string; */

  @Field()
  message: string;
}
