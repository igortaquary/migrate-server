import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lodge } from './lodge.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Lodge, (lodge) => lodge.id)
  lodge: Lodge;
}
