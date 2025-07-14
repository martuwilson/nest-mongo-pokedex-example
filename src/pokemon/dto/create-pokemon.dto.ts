import { IsInt, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;
}
