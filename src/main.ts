import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar prefijo global para todas las rutas
  app.setGlobalPrefix('api');
  
  // Habilitar CORS para desarrollo
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Pokédex app running on: http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
