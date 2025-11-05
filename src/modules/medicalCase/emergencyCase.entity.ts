import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
