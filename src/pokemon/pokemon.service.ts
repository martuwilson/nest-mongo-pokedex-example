import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
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

  async findOneBy(term: string) {
    let pokemon: Pokemon | null = null;

    // Verificar si es un número (para buscar por no)
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    // Si no se encontró y es un ObjectId válido, buscar por _id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Si no se encontró, buscar por nombre (case insensitive)
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ 
        name: term.toLowerCase().trim() 
      });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con término "${term}" no encontrado`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    // Primero buscamos el Pokemon usando nuestro método findOneBy
    const pokemon = await this.findOneBy(term);
    
    try {
      // Normalizar el nombre si viene en el DTO
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      // Actualizar el Pokemon en la base de datos
      const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(
        pokemon._id,
        updatePokemonDto,
        { 
          new: true, // Retorna el documento actualizado
          runValidators: true // Ejecuta las validaciones del schema
        }
      );

      return updatedPokemon;
    } catch (error) {
      if (error.code === 11000) {
        // Manejar error de duplicado
        const duplicatedKey = Object.keys(error.keyValue)[0];
        const duplicatedValue = error.keyValue[duplicatedKey];
        throw new BadRequestException(`Ya existe un Pokémon con ${duplicatedKey}: ${duplicatedValue}`);
      } else {
        // Manejar otros errores
        throw new InternalServerErrorException(`Error al actualizar el Pokémon: ${error.message}`);
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
