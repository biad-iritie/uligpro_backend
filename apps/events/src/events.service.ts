import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { join } from 'path';

import { PrismaService } from '../../../prisma/prisma.service';
import {
  buyTicketsEventInput,
  CreateEventInput,
  TransactionInput,
} from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Protect } from './utils/protect';

interface storeTicket {
  userId: string;
  eventId: string;
  ticket_categoryId: string;
  //code: string;
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
            /* {
              date: {
                gt: yesterday,
              },
            }, */
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
            orderBy: {
              createdAt: 'asc',
            },
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

  /*   async getCinetPayLink(req: any) {
    return 'ok';
  } */

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

  /* async postPaymentIntentsGetToken(
    transactionInfo: TransactionInput,
    req: any,
  ): Promise<PaymentIntent> {
    const userId: string = req.req.user.id;
    const present = new Date();

  

    try {
      const response = await fetch(
        `${process.env.HUB2SERVER}/payment-intents`,
        {
          method: 'POST',
          headers: {
            ApiKey: process.env.HUB2_KEY,
            MerchantId: process.env.HUB2_MERCHANT_ID,
            Environment: process.env.HUB2_ENVIRONMENT,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerReference: userId,
            purchaseReference: `${userId}_${present}`,
            amount: transactionInfo.amount,
            currency: 'XOF',
          }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        console.log(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.log(error);

      throw new Error('Error Server');
    }
  } */

  async postPaymentIntents(transactionInfo: TransactionInput, req: any) {
    try {
      /*const paymentIntent = await this.postPaymentIntentsGetToken(
        transactionInfo,
        req,
      );
      console.log(paymentIntent.token);
      console.log(transactionInfo.paymentMethod);
      console.log(transactionInfo.provider);
      console.log(transactionInfo.debitNumber);
      console.log(transactionInfo?.otp); */
      /* const response = await fetch(
        `${process.env.HUB2SERVER}/payment-intents/${paymentIntent.id}/payments`,
        {
          mode: 'cors',
          method: 'POST',
          headers: {
            ApiKey: process.env.HUB2_KEY,
            MerchantId: process.env.HUB2_MERCHANT_ID,
            Environment: process.env.HUB2_ENVIRONMENT,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: paymentIntent.token,
            paymentMethod: transactionInfo.paymentMethod,
            country: 'CI',
            provider: transactionInfo.provider,
            mobileMoney: {
              msisdn: transactionInfo.debitNumber,
              otp: transactionInfo?.otp,
            },
          }),
        },
      ); */
      //console.log(response);
      /*if (response.ok) {
        const result = await response.json();
        //console.log(result);

        await this.prisma.transaction.create({
          data: {
            intendId: result.id,
            paymentId: result.payments[0].id,
            amount: result.amount,
            amountWithFee: result.payments[0].amount,
            provider: result.payments[0].provider,
            debitNumber: result.payments[0].number,
            currency: result.payments[0].currency,
            country: result.payments[0].country,
            method: result.payments[0].method,
            intendCreatedAt: result.createdAt,
            status: result.status,
          },
        }); 
        //this.createWebhook();
        return result;
      } else {
        console.log(`HTTP Error: ${response.status}`);
      }*/
    } catch (error) {
      throw new Error('Error Server');
    }
  }

  async initiatingPayment(amount: number, transaction_id: string) {
    try {
      const response = await fetch(`${process.env.CINETPAY_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apikey: process.env.API_KEY_CINETPAY,
          site_id: process.env.SITE_ID,
          transaction_id: transaction_id,
          amount: amount,
          currency: 'XOF',
          description: 'Achat de ticket(s)',
          notify_url: process.env.ONLINE_SERVER_GATEWAY,
          return_url: `https://uligpro.com/payment-done/id=${transaction_id}`,
          channels: 'ALL',
        }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(
          "Desolé error dans le processus d'achat, ressayez plus tard",
        );
      }
    } catch (error) {
      throw new Error("Desolé error dans le processus d'achat");
    }
  }

  async generateTickets(tickets: buyTicketsEventInput[], req: any) {
    var fs = require('fs');
    //console.log(join(__dirname, '../../../', '/logs'));
    const path = join(__dirname, '../../../', '/logs');
    //console.log(req.req.user);

    var storeTickets: storeTicket[] = [];
    const userId: string = req.req.user.id;
    const present = new Date().getTime();
    const transaction_id = `${userId}_${present}`;

    /* let code: string;
    let payment_url: string;
    let payment_token: string; */
    try {
      // Get the actual purchase amount
      const amountTickets: number = await this.getPurchaseAmount(tickets, req);

      // GET THE URL FOR CHECKOUT
      const initPayment = await this.initiatingPayment(
        amountTickets,
        transaction_id,
      );
      //console.log(initPayment);

      if (initPayment.code === '201') {
        await this.prisma.$transaction(
          async (tx) => {
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
                    remaining.capacity -
                    remaining.ticket_sold -
                    ticket.quantity;
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

            //GENERATE TICKET CODE
            tickets.map((ticket) => {
              for (let i = 0; i < ticket.quantity; i++) {
                storeTickets.push({
                  userId: userId,
                  eventId: ticket.eventId,
                  ticket_categoryId: ticket.ticket_categoryId,
                  //code: crypto.randomUUID(),
                });
              }
            });

            await this.prisma.transaction.create({
              data: {
                id: transaction_id,
                amount: amountTickets,
                status: initPayment.message,
                tickets: {
                  createMany: {
                    data: storeTickets,
                  },
                },
              },
            });
          },
          {
            timeout: 15000,
          },
        );

        const result = {
          code: initPayment.code,
          payment_url: initPayment.data.payment_url,
          payment_token: initPayment.data.payment_token,
          payment_id: transaction_id,
        };
        //console.log(result);
        return result;
      } else {
        throw new Error('Svp ressayez plus tard, soucis au niveau du server !');
      }
    } catch (error) {
      let writeStream = fs.createWriteStream(`${path}/log_${present}.txt`);
      writeStream.write(error.message);
      writeStream.end();
      //console.log(error);
      throw new Error(
        'Error dans generation des tickets ressayer, contacter le service client SVP',
      );
    }
  }

  async checkPayment(idTransaction: string) {
    //console.log(idTransaction);

    try {
      const response = await fetch(
        `${process.env.CINETPAY_URL}/payment/check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apikey: process.env.API_KEY_CINETPAY,
            site_id: process.env.SITE_ID,
            transaction_id: idTransaction,
          }),
        },
      );
      //console.log(await response.json());
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async actionAfterPayment(idTransaction: string) {
    try {
      const result = await this.checkPayment(idTransaction);
      console.log(result);

      if (result.code === '00') {
        //good
        await this.prisma.transaction.update({
          where: {
            id: idTransaction,
          },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(result.data.payment_date),
            method: result.data.payment_method,
            provider: result.data.operator_id,
            tickets: {
              updateMany: {
                where: {
                  transactionId: idTransaction,
                },
                data: {
                  valid: true,
                },
              },
            },
          },
        });
        return { message: 'SUCCESS' };
      }
      if (result.code === '627') {
        const tickets = await this.prisma.ticket.findMany({
          where: {
            transactionId: idTransaction,
          },
        });

        for (let i = 0; i < tickets.length; i++) {
          await this.prisma.ticket_categoryOnEvent.updateMany({
            where: {
              AND: [
                { eventId: tickets[i].eventId },
                { ticket_categoryId: tickets[i].ticket_categoryId },
              ],
            },
            data: {
              ticket_sold: {
                decrement: 1,
              },
            },
          });
        }
        return { message: 'FAILLED' };
      } else {
        return { message: 'PENDING' };
      }
    } catch (error) {
      console.log(error);
      throw new Error(
        'Erreur server survenue, SVP informez le service client ',
      );
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
          AND: [
            { userId: req.req.user.id },
            { scanned: false },
            { valid: true },
          ],
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
          ticket_category: {
            include: {
              ticket_categoryOnEvent: true,
            },
          },
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
    if (req.req.user.role.name === 'REGULAR') {
      throw new UnauthorizedException(
        "You don't have access to this ressource!",
      );
    } else {
      try {
        const checked = await this.prisma.ticket.findUnique({
          where: {
            code: code,
            event: {
              onSell: true,
            },
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
          if (checked.nature === 'PHYSICAL') {
            await this.prisma.ticketDoublons.create({
              data: checked,
            });
          }
          return {
            status: false,
            error: {
              code: '406',
              message: `Ticket a été déjà scanné le ${checked.scannedAt.getUTCDate()}-${checked.scannedAt.getUTCMonth()}-${checked.scannedAt.getUTCFullYear()} ${checked.scannedAt.getUTCHours()}:${checked.scannedAt.getMinutes()}`,
            },
          };
        }
      } catch (error) {
        console.log(error);
        throw new Error(
          "Le code n'existe pas ou le ticket n'est plus utilisable",
        );
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
