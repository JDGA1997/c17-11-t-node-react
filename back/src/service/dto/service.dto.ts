import { IsNotEmpty, IsNumber, IsOptional, IsString,  } from "class-validator";


export class CreateServiceDTO {
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsNumber()
    @IsNotEmpty()
    price:number
}

export class UpdateServiceDTO {
    // name?: string
    @IsString()
    @IsOptional()
    name:string;

    @IsNumber()
    @IsOptional()
    price:number

}