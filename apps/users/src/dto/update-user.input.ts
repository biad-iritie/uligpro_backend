import { CreateRegularUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateRegularUserInput) {
  /* @Field(() => Int)
  id: number; */
}
