import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Lodge } from './lodge.entity';
import { Institution } from './institution.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column()
  address: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column({ default: 'Brasil' })
  country: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @OneToOne(() => Lodge, (lodge) => lodge.location)
  lodge: Relation<Lodge>;

  @OneToOne(() => Institution, (institution) => institution.location)
  institution: Relation<Institution>;
}
