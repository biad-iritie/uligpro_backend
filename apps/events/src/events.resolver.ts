import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthGuard } from 'apps/users/src/guard/auth.guard';

import {
  buyTicketsEventInput,
  TransactionInput,
} from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';
import { Ticket } from './entities/ticket.entity';

import { EventsService } from './events.service';
import {
  EventDetailsResponse,
  FindAllResponse,
  BasicResponse,
  TicketsResponse,
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
  @UseGuards(AuthGuard)
  async getPurchaseAmount(
    @Args('tickets', { type: () => [buyTicketsEventInput] })
    tickets: buyTicketsEventInput[],
    @Context() context: { req: Request },
  ) {
    return await this.eventsService.getPurchaseAmount(tickets, context);
  }

  @Mutation(() => BasicResponse)
  @UseGuards(AuthGuard)
  async buyTickets(
    @Args('tickets', { type: () => [buyTicketsEventInput] })
    tickets: buyTicketsEventInput[],
    @Context() context: { req: Request },
    @Args('transaction', { type: () => TransactionInput })
    transaction: TransactionInput,
  ) {
    return await this.eventsService.generateTickets(
      tickets,
      transaction,
      context,
    );
  }

  @Query(() => TicketsResponse)
  @UseGuards(AuthGuard)
  async getUserTickets(
    @Context() context: { req: Request },
  ): Promise<TicketsResponse> {
    return await this.eventsService.getUserTickets(context);
  }

  @Query(() => String, { name: 'getQRcode' })
  async generateQRCode(
    @Args('code', { type: () => String }) code: string,
  ): Promise<String> {
    return await this.eventsService.generateQRCode(code);
  }

  @Mutation(() => String, { name: 'getTicketScanned' })
  @UseGuards(AuthGuard)
  async scanTicket(
    @Args('code', { type: () => String }) code: string,
  ): Promise<String> {
    return await this.eventsService.scanTicket(code);
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
