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

  @Post('tx')
  async crearUsuarioTransaccional(
    @Body()
    createUserDto: {
      email: string;
      name: string;
      phone: string;
      bio: string;
    },
  ) {
    const user = await this.userService.createUserTransactional(
      createUserDto.email,
      createUserDto.name,
      createUserDto.phone,
      createUserDto.bio,
    );
    return {
      message: 'Usuario creado con perfil y notificación (transaccional)',
      user,
    };
  }

  @Post('tx-only')
  async crearSoloUsuarioTransaccional(
    @Body() createUserDto: { email: string; name: string; phone: string },
  ) {
    const user = await this.userService.createUserOnlyTransactional(
      createUserDto.email,
      createUserDto.name,
      createUserDto.phone,
    );
    return {
      message: 'Usuario creado (solo usuario, transaccional)',
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
