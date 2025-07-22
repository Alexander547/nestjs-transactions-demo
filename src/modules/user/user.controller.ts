import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private dataSource: DataSource,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('transaccion')
  async crearUsuarioConNotificacion(
    @Body()
    createUserDto: {
      email: string;
      name: string;
      phone: string;
      bio: string;
    },
  ) {
    const user = await this.userService.createUserWithTransaction(
      createUserDto.email,
      createUserDto.name,
      createUserDto.phone,
      createUserDto.bio,
    );

    return {
      message: 'Usuario creado con perfil y notificación enviada exitosamente',
      user,
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
