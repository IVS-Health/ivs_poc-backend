import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  token: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn() // foreign key
  user: User;
}
