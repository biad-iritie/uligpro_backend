import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
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
          ticket_categoryOnEvent: {
            include: {
              ticket_category: true,
            },
          },
        },
      });
      return { events };
    } catch (error) {
      return { error: { message: 'Error to fetch the events' } };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventInput: UpdateEventInput) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
