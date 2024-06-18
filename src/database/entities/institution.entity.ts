import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from './location.entity';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToOne(() => Location, (loc) => loc.id, { nullable: false })
  location: Location;
}
