import { Exclude } from 'class-transformer';

export class CurrentUserResponseDto {
  id: number;
  name:string;
  email:string;
 
  @Exclude()
  password: string;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<CurrentUserResponseDto>) {
    Object.assign(this, partial);
  }
}