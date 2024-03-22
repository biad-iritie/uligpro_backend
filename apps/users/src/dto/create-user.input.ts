import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateRegularUserInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must need to be one string.' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email est invalide.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Mot de passe doit être au moins 8 charactères.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Phone Number is required.' })
  @MinLength(10, { message: 'Le numero doit être au moins 10 chiffre.' })
  tel: string;

  @Field()
  confirmed?: boolean = true;
  /* @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number; */
}

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must need to be one string.' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email est invalide.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Mot de passe doit être au moins 8 charactères.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Phone Number is required.' })
  @MinLength(10, { message: 'Le numero doit être au moins 10 chiffre.' })
  tel: string;

  @Field()
  confirmed?: boolean = true;

  @Field()
  roleNmae: string;
  /* @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number; */
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: 'Activation token is required.' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'Activation code is required.' })
  activationCode: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;
}
