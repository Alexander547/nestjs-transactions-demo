/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { User } from '../user/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProfileService {
  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async createProfile(bio: string, user: User, manager: EntityManager) {
    try {
      const profile = new Profile();
      profile.bio = bio;
      profile.user = user;
      return await manager.save(Profile, profile);
    } catch (err) {
      // Log, transformar el error, o lanzar una excepción específica
      throw new Error('Error al crear el perfil: ' + err.message);
    }
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
