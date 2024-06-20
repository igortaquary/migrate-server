import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const BR_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column()
  address: string;

  @Column({ length: 2 })
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

  /* @OneToOne(() => Lodge, (lodge) => lodge.location)
  lodge: Relation<Lodge>; */

  /* @OneToOne(() => Institution, (institution) => institution.location)
  institution: Relation<Institution>; */
}
