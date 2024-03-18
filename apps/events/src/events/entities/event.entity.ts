import { ObjectType, Field, Int, ID, Directive } from '@nestjs/graphql';
import { Venue } from './venue.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class Event {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  date: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  evenueId: number;

  @Field(() => Venue)
  venue?: Venue;

  @Field(() => Ticket_categoryOnEvent)
  Ticket_categoryOnEvent: Ticket_categoryOnEvent[];

  @Field(() => Match)
  Match: Match[];
}
