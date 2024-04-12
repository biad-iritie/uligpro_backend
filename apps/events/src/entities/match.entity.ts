import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Team } from './team.entity';
import { Event } from './event.entity';

@ObjectType()
@Directive('@key(fields:"team1Id,team2Id,eventId")')
export class Match {
  @Field()
  time: Date;

  @Field()
  team1Id: string;

  @Field(() => Team)
  team1: Team;

  @Field()
  team2Id: string;

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
  teamIdWinner?: string;

  @Field()
  eventId: string;

  @Field(() => Event)
  event: Event;
}
