import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Location } from './location.entity';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToOne(() => Location, { nullable: false, cascade: true })
  @JoinColumn()
  location: Relation<Location>;
}
