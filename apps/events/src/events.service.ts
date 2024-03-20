import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  buyTicketsEventInput,
  CreateEventInput,
  TransactionInput,
} from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Protect } from './utils/protect';
const crypto = require('crypto');

interface storeTicket {
  userId: string;
  eventId: string;
  ticket_categoryId: string;
  code: string;
}

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
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

  async findOne(id: string) {
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

  async generateTickets(
    tickets: buyTicketsEventInput[],
    transaction: TransactionInput,
  ) {
    var storeTickets: storeTicket[] = [];

    //GENERATE TICKET CODE
    tickets.map((ticket) => {
      for (let i = 0; i < ticket.quantity; i++) {
        storeTickets.push({
          userId: '4',
          eventId: ticket.eventId,
          ticket_categoryId: ticket.ticket_categoryId,
          code: crypto.randomUUID(),
        });
      }
    });
    try {
      await this.prisma.transaction.create({
        data: {
          code: transaction.code,
          amount: transaction.amount,
          debitNumber: transaction.debitNumber,
          way: transaction.way,
          didAt: transaction.didAt,
          tickets: {
            createMany: {
              data: storeTickets,
            },
          },
        },
      });
      return { message: 'Ticket(s) genérés' };
    } catch (error) {
      console.log(error);

      return { message: 'Error in generating tickets' };
    }
  }

  async getPurchaseAmount(tickets: buyTicketsEventInput[]) {
    var total: number = 0;
    const officialPrices = await this.getTicketsPrice(tickets[0].eventId);
    //console.log(officialPrices);
    tickets.map((ticket) => {
      officialPrices.filter((officialPrice) => {
        if (ticket.ticket_categoryId === officialPrice.ticket_categoryId)
          total += officialPrice.price * ticket.quantity;
      });
    });
    return total;
  }

  async getTicketsPrice(eventId: string) {
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

  async getUserTickets() {
    try {
      const tickets = this.prisma.ticket.findMany({
        where: {
          AND: [{ userId: '4' }, { scanned: false }],
        },
        include: {
          event: true,
          ticket_category: true,
        },
      });
      return { tickets };
    } catch (error) {
      return {
        error: {
          message: ' Error to fetch the user tickets',
        },
      };
    }
  }

  async generateQRCode(code: string) {
    const protect_code = new Protect(this.config);
    const crypted = protect_code.encryptData(code);
    return crypted;
  }

  async scanTicket(code: string) {
    const date = new Date();
    try {
      const checked = await this.prisma.ticket.findUnique({
        where: {
          code,
        },
      });

      if (checked.scanned !== true) {
        await this.prisma.ticket.update({
          where: {
            code: code,
          },
          data: {
            scanned: true,
            scannedAt: date,
          },
        });
        return 'Ticket scannée';
      } else {
        return `Ticket a été déjà scanné le ${checked.scannedAt.getUTCDate()}-${checked.scannedAt.getUTCMonth()}-${checked.scannedAt.getUTCFullYear()} ${checked.scannedAt.getUTCHours()}:${checked.scannedAt.getMinutes()}`;
      }
    } catch (error) {
      console.log(error);
      return 'Error dans le processus de scan';
    }
  }
  update(id: number, updateEventInput: UpdateEventInput) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
