import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Match } from './match.entity';
import { Ticket_categoryOnEvent } from './ticket_categoryOnEvent';
import { Venue } from './venue.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class Event {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  date: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  onSell: boolean;

  @Field()
  display: boolean;

  @Field()
  evenueId: string;

  @Field(() => Venue)
  venue?: Venue;

  @Field(() => [Ticket_categoryOnEvent])
  ticket_categoryOnEvent?: Ticket_categoryOnEvent[];

  @Field(() => [Match])
  matches?: Match[];
}
