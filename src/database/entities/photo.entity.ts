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

  @Column({ type: 'varchar', length: 512 })
  url: string;

  @Column({ type: 'int' })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'uuid' })
  lodgeId: string;

  @ManyToOne(() => Lodge, (lodge) => lodge.id, {
    nullable: false,
    orphanedRowAction: 'delete',
  })
  lodge: Lodge;
}
