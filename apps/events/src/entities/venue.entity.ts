import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
@ObjectType()
@Directive('@key(fields:"id")')
export class Venue {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field(() => [Event])
  event?: Event[];
}
