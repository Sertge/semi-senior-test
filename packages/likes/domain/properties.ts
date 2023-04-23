import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import { Like } from './likes'

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

  @OneToMany(() => Like, (like) => like.property, { cascade: [ 'insert' ] })
  likes: Like[]
}
