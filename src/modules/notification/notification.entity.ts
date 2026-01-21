import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
} from "typeorm";
import { Token } from "../token/token.entity";
import { EmergencyCase } from "../medicalCase/emergencyCase.entity";

@Entity()
@Unique(["case", "token"]) // prevents duplicate notification for same case+token
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EmergencyCase, { onDelete: "CASCADE" })
  case: EmergencyCase;

  @ManyToOne(() => Token, { onDelete: "CASCADE" })
  token: Token;

  @Column({ nullable: false, default: "sent" })
  status: string;
}
