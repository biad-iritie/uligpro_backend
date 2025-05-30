import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Ticket_category } from './ticket_category';
import { Event } from './event.entity';

@ObjectType()
@Directive('@key(fields:"eventId,ticket_categoryId")')
export class Ticket_categoryOnEvent {
  @Field(() => Event)
  event: Event;
  @Field()
  eventId: string;
  @Field()
  ticket_categoryId: string;

  @Field(() => Ticket_category)
  ticket_category: Ticket_category;

  @Field()
  price: number;

  @Field()
  capacity: number;

  @Field()
  ticket_sold: number;
}
