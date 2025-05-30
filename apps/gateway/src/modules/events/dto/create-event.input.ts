import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

@InputType()
export class buyTicketsEventInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Select an event' })
  eventId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Select a ticket category' })
  ticket_categoryId: string;

  @Field()
  @IsNotEmpty({ message: 'Select a quantity' })
  quantity: number;
}

@InputType()
export class TransactionInput {
  /* @Field(() => String)
  @IsNotEmpty({ message: 'Select an event' })
  code: string; */
  @Field(() => Int)
  @IsNotEmpty({ message: 'Select an amount' })
  amount: number = 0;

  @Field(() => String)
  @IsNotEmpty({ message: 'Select a debitNumber' })
  @MinLength(10, { message: 'Le numero doit être au moins 10 chiffre.' })
  debitNumber: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Select a way' })
  provider: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Select a payment method' })
  method: string;

  @Field(() => String, { nullable: true })
  //@IsNotEmpty({ message: 'Enter OTP' })
  otp: string = '';

  @Field()
  @IsNotEmpty({ message: 'Select a didAt' })
  didAt: Date;
}

@InputType()
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
@InputType()
export class Hub2Data {
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
