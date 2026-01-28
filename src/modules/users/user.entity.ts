import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Token } from "../token/token.entity";
import { EmergencyCase } from "../medicalCase/emergencyCase.entity";

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

  @OneToMany(() => EmergencyCase, (emergencyCase) => emergencyCase.assignedTo)
  assignedCases: EmergencyCase[];
}
