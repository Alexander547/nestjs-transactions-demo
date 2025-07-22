import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setDataSource } from './common/transactional.decorator';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan propiedades no permitidas
      transform: true, // transforma payloads al tipo del DTO
    }),
  );

  const dataSource = app.get(DataSource); // <-- Esto obtiene el DataSource de TypeORM
  setDataSource(dataSource); // <-- Esto lo pasa al decorador
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
