import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { buyTicketsEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';

import { EventsService } from './events.service';
import {
  ByTicketsResponse,
  EventDetailsResponse,
  FindAllResponse,
} from './types/event.type';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  /*   @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.create(createEventInput);
  } */

  @Query(() => FindAllResponse, { name: 'getComingEvents' })
  async findAll(): Promise<FindAllResponse> {
    return await this.eventsService.findAll();
  }

  @Query(() => EventDetailsResponse, { name: 'getEventDetail' })
  async findEventDetail(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EventDetailsResponse> {
    return await this.eventsService.findOne(id);
  }

  @Mutation(() => ByTicketsResponse)
  async buyTickets(
    @Args('tickets', { type: () => [buyTicketsEventInput] })
    tickets: buyTicketsEventInput[],
  ) {
    console.log(tickets[0]);

    return await this.eventsService.buyTickets(tickets);
  }
  @Query(() => Event, { name: 'event' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.remove(id);
  }
}
