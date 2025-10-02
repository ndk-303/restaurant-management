import {IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: 'Name must not be empty'})
    name: string;
    
    @IsEmail({}, {message: 'Invalid email message'})
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty({message: 'Password must not be empty'})
    password: string;
    
    phone: string;
    address: string;
    image: string;
}
