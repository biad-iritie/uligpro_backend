import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { buyTicketsEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';

import { EventsService } from './events.service';
import {
  EventDetailsResponse,
  FindAllResponse,
  TestResponse,
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
    @Args('id', { type: () => String }) id: string,
  ): Promise<EventDetailsResponse> {
    return await this.eventsService.findOne(id);
  }

  @Query(() => Int)
  async getPurchaseAmount(
    @Args('tickets', { type: () => [buyTicketsEventInput] })
    tickets: buyTicketsEventInput[],
  ) {
    return await this.eventsService.getPurchaseAmount(tickets);
  }

  @Mutation(() => TestResponse)
  async generateTickets(
    @Args('tickets', { type: () => [buyTicketsEventInput] })
    tickets: buyTicketsEventInput[],
    @Args('transactionCode', { type: () => String })
    transactionCode: string,
    @Args('transactionDate', { type: () => Date })
    transactionDate: Date,
  ) {
    this.eventsService.generateTickets(
      tickets,
      transactionCode,
      transactionDate,
    );
  }

  @Query(() => Event, { name: 'event' })
  findOne(@Args('id', { type: () => String }) id: string) {
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
