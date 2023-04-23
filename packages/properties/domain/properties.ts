import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'

@Entity({ name: 'property' })
export class Property {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  address: string

  @Column()
  city: string

  @Column({type: 'numeric'})
  price: number

  @Column()
  description: string

  @Column({type: 'int4'})
  year: number

}
