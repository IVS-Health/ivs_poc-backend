import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class EmergencyCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: true })
  callBackNumber: string;

  @Column({ nullable: true })
  natureOfEmergency: string;

  @Column({ nullable: true })
  patientCondition: string;

  @Column({ nullable: false, default: "open" })
  status: string;

  @ManyToOne(() => User, (user) => user.assignedCases, { nullable: true })
  @JoinColumn({ name: "assignedToUserId" }) // DB column name
  assignedTo: User | null;
}
