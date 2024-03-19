import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  buyTicketsEventInput,
  CreateEventInput,
} from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEventInput: CreateEventInput) {
    return 'This action adds a new event';
  }

  async findAll() {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    try {
      const events = await this.prisma.event.findMany({
        relationLoadStrategy: 'join',
        where: {
          date: {
            gt: yesterday,
          },
        },
        include: {
          venue: true,
          //ticket_categoryOnEvent: true,
          match: {
            include: {
              team1: true,
              team2: true,
            },
          },
        },
      });
      return { events };
    } catch (error) {
      return { error: { message: 'Error to fetch the events' } };
    }
  }

  async findOne(id: number) {
    try {
      const tickets = this.prisma.ticket_categoryOnEvent.findMany({
        relationLoadStrategy: 'join',
        where: {
          AND: [
            { eventId: id },
            {
              capacity: {
                gt: this.prisma.ticket_categoryOnEvent.fields.ticket_sold,
              },
            },
          ],
        },
        include: {
          ticket_category: true,
        },
      });
      return { tickets };
    } catch (error) {
      return { error: { message: 'Error to fetch the detail' } };
    }
  }

  async buyTickets(tickets: buyTicketsEventInput[]) {
    var total: number = 0;
    const officialPrices = await this.getTicketPrice(tickets[0].eventId);
    //console.log(officialPrices);

    tickets.map((ticket) => {
      officialPrices.filter((officialPrice) => {
        if (ticket.ticket_categoryId === officialPrice.ticket_categoryId)
          total += officialPrice.price * ticket.quantity;
      });
    });
    return total;
  }

  async getTicketPrice(eventId: number) {
    return await this.prisma.ticket_categoryOnEvent.findMany({
      where: {
        AND: [{ eventId }],
      },
      select: {
        price: true,
        ticket_categoryId: true,
      },
    });
  }

  update(id: number, updateEventInput: UpdateEventInput) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
