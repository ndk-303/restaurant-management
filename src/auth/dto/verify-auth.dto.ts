import {IsNotEmpty} from 'class-validator';

export class VerifyAuthDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  codeId: string;
}
