import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Ticket_categoryOnEvent } from './ticket_categoryOnEvent';

@ObjectType()
@Directive('@key(fields:"id")')
export class Ticket_category {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => [Ticket_categoryOnEvent], { nullable: true })
  Ticket_categoryOnEvent: Ticket_categoryOnEvent[];
}
