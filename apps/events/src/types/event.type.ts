import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorType } from 'apps/users/src/types/user.type';
import { Event } from '../entities/event.entity';

@ObjectType()
export class FindAllResponse {
  /* @Field()
  activation_token: string; */
  @Field(() => [Event], { nullable: true })
  events?: Event[] | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
