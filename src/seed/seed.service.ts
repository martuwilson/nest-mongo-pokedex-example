import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  async executeSeedData() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data: PokeResponse = await response.json();

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2]; // Extrae el número del Pokémon. Es -2 porque el último segmento es una cadena vacía.
      console.log(`Pokémon: ${name}, No: ${no}`);
    });

    return data.results;
  }

}
