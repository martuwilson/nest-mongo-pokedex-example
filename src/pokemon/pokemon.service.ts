import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}
  

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      //Insertar el nuevo Pokémon en la base de datos
      const createdPokemon = await this.pokemonModel.create(createPokemonDto);
  
      return createdPokemon;
    
    } catch (error) {
      if(error.code === 11000) {
        // Manejar error de duplicado
        throw new BadRequestException(`El Pokémon con el nombre ${createPokemonDto.name} ya existe.`);
      } else {
        // Manejar otros errores
        throw new InternalServerErrorException(`Error al crear el Pokémon: ${error.message}`);
      }
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
