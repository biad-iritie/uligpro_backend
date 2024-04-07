import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt, randomUUID } from 'crypto';
import { throwError } from 'rxjs';
import { text } from 'stream/consumers';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  buyTicketsEventInput,
  CreateEventInput,
  TransactionInput,
} from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { User } from './entities/user.entity';
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
        orderBy: {
          date: 'asc',
        },
        where: {
          AND: [
            {
              date: {
                gt: yesterday,
              },
            },
            { display: true },
          ],
        },
        include: {
          venue: true,
          ticket_categoryOnEvent: {
            include: {
              ticket_category: true,
            },
          },
          matches: {
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
    req: any,
  ) {
    var storeTickets: storeTicket[] = [];

    try {
      await this.prisma.$transaction(async (tx) => {
        // check the remaining tickets
        const remainingTickets = await tx.ticket_categoryOnEvent.findMany({
          where: {
            eventId: tickets[0].eventId,
          },
        });

        tickets.map((ticket) => {
          remainingTickets.map((remaining) => {
            if (remaining.ticket_categoryId == ticket.ticket_categoryId) {
              //check if number of ticket purchasing it not more the remainning
              const nbr_check =
                remaining.capacity - remaining.ticket_sold - ticket.quantity;
              if (nbr_check < 0) {
                throw new Error(
                  'Le nombre ticket demandé est superieur au ticket disponible, veillez reduire SVP',
                );
              }
            }
          });
        });

        //INCREMENT SOLD_TICKET

        for (let i = 0; i < tickets.length; i++) {
          const modified = await tx.ticket_categoryOnEvent.update({
            where: {
              eventId_ticket_categoryId: {
                eventId: tickets[i].eventId,
                ticket_categoryId: tickets[i].ticket_categoryId,
              },
            },
            data: {
              ticket_sold: {
                increment: tickets[i].quantity,
              },
            },
          });
        }

        // Get the actual purchase amount
        transaction.amount = await this.getPurchaseAmount(tickets, req);

        // connecting with the API payment
        const { codeStatus, code, amount, debit_number, way, didAt }: any =
          await this.facking_paymentAPI({
            amount: transaction.amount,
            debitNumber: transaction.debitNumber,
            way: transaction.way,
          });

        if (codeStatus === 1) {
          //GENERATE TICKET CODE
          tickets.map((ticket) => {
            for (let i = 0; i < ticket.quantity; i++) {
              storeTickets.push({
                userId: req.req.user.id,
                eventId: ticket.eventId,
                ticket_categoryId: ticket.ticket_categoryId,
                code: crypto.randomUUID(),
              });
            }
          });

          await this.prisma.transaction.create({
            data: {
              code: code,
              amount: amount,
              debitNumber: debit_number,
              way: way,
              didAt: didAt,
              tickets: {
                createMany: {
                  data: storeTickets,
                },
              },
            },
          });
        } else {
          throw new Error(
            'La transaction a echoué, veillez réesayez plus tard',
          );
        }
      });

      return {
        message: 'Allez dans votre profil pour telecharger vos tickets',
      };
    } catch (error) {
      //console.log(error);

      return { message: 'Error in generating tickets' };
    }
  }

  async facking_paymentAPI(data: {
    amount: number;
    debitNumber: string;
    way: string;
  }) {
    return {
      codeStatus: 1,
      code: randomInt(10000000000).toString(),
      amount: data.amount,
      debit_number: data.debitNumber,
      way: data.way,
      didAt: new Date(),
    };
  }
  async getPurchaseAmount(tickets: buyTicketsEventInput[], req: any) {
    var total: number = 0;
    const officialPrices = await this.getTicketsPrice(tickets[0].eventId);
    ////console.log(officialPrices);
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

  async getUserTickets(req: any) {
    try {
      //console.log(req.req.user);

      const tickets = this.prisma.ticket.findMany({
        where: {
          AND: [{ userId: req.req.user.id }, { scanned: false }],
        },
        include: {
          event: {
            include: {
              matches: {
                include: {
                  team1: true,
                  team2: true,
                },
              },
            },
          },
          ticket_category: true,
        },
      });
      return { tickets };
    } catch (error) {
      console.log(error);

      return {
        error: {
          message: 'Desolé une erreur, ressayez plus tard',
        },
      };
    }
  }

  async generateQRCode(code: string) {
    const protect_code = new Protect(this.config);
    const crypted = protect_code.encryptData(code);
    return crypted;
  }

  async scanTicket(code: string, req: any) {
    const date = new Date();
    if (req.user.role.name === 'REGULAR') {
      throw new UnauthorizedException(
        "You don't have access to this ressource!",
      );
    } else {
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
              scannedByUserId: req.req.user.id,
            },
          });
          return { status: true };
        } else {
          return {
            status: false,
            error: {
              code: '406',
              message: `Ticket a été déjà scanné le ${checked.scannedAt.getUTCDate()}-${checked.scannedAt.getUTCMonth()}-${checked.scannedAt.getUTCFullYear()} ${checked.scannedAt.getUTCHours()}:${checked.scannedAt.getMinutes()}`,
            },
          };
        }
      } catch (error) {
        return {
          status: false,
          error: {
            code: '404',
            message: 'le code n existe pas',
          },
        };
      }
    }
  }
  update(id: number, updateEventInput: UpdateEventInput) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
