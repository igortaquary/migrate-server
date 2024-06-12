import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Institution } from './institution.entity';
import { Photo } from './photo.entity';
import { User } from './user.entity';

enum LodgeType {
  ENTIRE = 0,
  ROOM = 1,
  BED = 2,
}

@Entity()
export class Lodge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ enum: LodgeType, type: 'enum' })
  type: LodgeType;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Institution, (institution) => institution.id)
  institution: Institution;

  @OneToOne(() => User, (user) => user.id)
  host: User;

  @OneToMany(() => Photo, (photo) => photo.lodge)
  photos: Photo[];
}
