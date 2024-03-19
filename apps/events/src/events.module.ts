import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';

import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    PrismaModule,
  ],
  providers: [EventsResolver, EventsService, PrismaService],
})
export class EventsModule {}
