/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  price: number;
}
