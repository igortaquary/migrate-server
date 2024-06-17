import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Institution } from './institution.entity';
import { Photo } from './photo.entity';
import { User } from './user.entity';

export enum LodgeType {
  ENTIRE = 0,
  ROOM = 1,
  SHARED_ROOM = 2,
}

export enum SpaceType {
  APARTMENT = 0,
  HOUSE = 1,
  OTHER = 2,
}

@Entity()
export class Lodge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column({ enum: LodgeType, type: 'enum', nullable: false })
  type: LodgeType;

  @Column({ enum: SpaceType, type: 'enum', nullable: false })
  space: SpaceType;

  @ManyToOne(() => Institution, (institution) => institution.id)
  institution: Institution;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @OneToMany(() => Photo, (photo) => photo.lodge)
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
