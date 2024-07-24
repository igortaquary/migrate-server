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
  ENTIRE = 1,
  ROOM = 2,
  SHARED_ROOM = 3,
}

export enum SpaceType {
  APARTMENT = 1,
  HOUSE = 2,
  OTHER = 3,
}

export enum DirectionMode {
  DRIVING = 'driving',
  WALKING = 'walking',
  BICYCLING = 'bicycling',
  TRANSIT = 'transit',
}

export enum LodgeStatus {
  ACTIVE = 1,
  ANALYSING = 2,
  BLOCKED = 3,
}

@Entity()
export class Lodge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  price: number;

  @Column({ default: 'any' })
  gender: 'male' | 'female' | 'any';

  @Column({ default: 'all' })
  contactInfo: 'phone' | 'email' | 'all';

  @Column({ enum: LodgeType, type: 'enum', nullable: false })
  type: LodgeType;

  @Column({ enum: SpaceType, type: 'enum', nullable: false })
  space: SpaceType;

  @Column({
    enum: LodgeStatus,
    type: 'enum',
    nullable: false,
    default: LodgeStatus.ACTIVE,
  })
  status: LodgeStatus;

  @Column({ nullable: true })
  distanceFromInstitution: number;

  @Column({ enum: DirectionMode, type: 'enum', nullable: true })
  directionMode: DirectionMode;

  @OneToOne(() => Location, { cascade: true })
  @JoinColumn()
  location: Relation<Location>;

  @ManyToOne(() => Institution, (institution) => institution.id, {
    nullable: true,
  })
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
