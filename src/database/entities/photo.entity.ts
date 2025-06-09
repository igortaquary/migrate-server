import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lodge } from './lodge.entity';
import { StorageProvider } from 'src/config/minio.config';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  url: string =
    'https://archive.org/download/placeholder-image/placeholder-image.jpg';

  @AfterLoad()
  loadUrl() {
    this.url = StorageProvider.publicUrlBaseHref.concat(
      this.id + '.' + this.type,
    );
  }

  @Column({ type: 'varchar', length: 10, default: 'jpeg' })
  type: string;

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
