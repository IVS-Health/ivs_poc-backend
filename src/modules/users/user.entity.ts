import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Token } from "../token/token.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: "int", nullable: true })
  age?: number;

  @Column({ nullable: true })
  medicalSpecialty?: string;

  @OneToOne(() => Token, (token) => token.user)
  token?: Token;
}
