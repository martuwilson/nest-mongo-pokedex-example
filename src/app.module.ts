import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-pokemon'),

    PokemonModule,

    SeedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
