import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Match } from './match.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class Team {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
  @Field()
  logo: string;
  @Field()
  university: string;

  @Field(() => Match)
  matchHome: Match[];

  @Field(() => Match)
  matchAway: Match[];

  @Field(() => Match)
  match: Match[];
}
