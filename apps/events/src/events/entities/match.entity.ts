import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Team } from './team.entity';

@ObjectType()
@Directive('@key(fields:"team1Id,team2Id,eventId")')
export class Match {
  @Field()
  time: Date;

  @Field()
  team1Id: number;

  @Field(() => Team)
  team1: Team;

  @Field()
  team2Id: number;

  @Field(() => Team)
  team2: Team;

  @Field()
  goal1: number;
  @Field()
  goal2: number;

  @Field()
  winner: number;

  @Field(() => Team)
  teamWinner?: Team;

  @Field()
  teamIdWinner?: number;

  @Field()
  eventId: number;

  @Field(() => Event)
  event: Event;
}
