import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorType } from 'apps/users/src/types/user.type';
import { Event } from '../entities/event.entity';
import { Ticket_categoryOnEvent } from '../entities/ticket_categoryOnEvent';

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
