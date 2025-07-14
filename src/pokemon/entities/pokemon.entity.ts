import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, unique: true })
    no: number;
    
    /* @Prop({ required: true })
    type: string;
    
    @Prop({ required: true })
    level: number;
    
    @Prop({ required: true })
    hp: number;
    
    @Prop({ required: true })
    attack: number;
    
    @Prop({ required: true })
    defense: number;
    
    @Prop({ required: true })
    speed: number; */

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
