import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Institution } from './institution.entity';
import { Photo } from './photo.entity';
import { User } from './user.entity';
import { Location } from './location.entity';

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

  @Column({ nullable: true })
  distanceFromInstitution: number;

  @OneToOne(() => Location, (location) => location.id, { cascade: true })
  @JoinColumn()
  location: Relation<Location>;

  @ManyToOne(() => Institution, (institution) => institution.id)
  institution: Relation<Institution>;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: Relation<User>;

  @OneToMany(() => Photo, (photo) => photo.lodge)
  photos: Relation<Photo>[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
