import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

@InputType()
export class buyTicketsEventInput {
  @Field(() => Int)
  @IsNotEmpty({ message: 'Select an event' })
  eventId: number;

  @Field(() => Int)
  @IsNotEmpty({ message: 'Select a ticket category' })
  ticket_categoryId: number;

  @Field()
  @IsNotEmpty({ message: 'Select a quantity' })
  quantity: number;
}
