import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Match } from './match.entity';
import { Ticket_categoryOnEvent } from './ticket_categoryOnEvent';
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

  @Field(() => [Ticket_categoryOnEvent])
  ticket_categoryOnEvent?: Ticket_categoryOnEvent[];

  @Field(() => [Match])
  match?: Match[];
}
