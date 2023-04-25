import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm'
import { Like } from './likes'
import { Status } from './status'
import { json } from 'express'


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

  @ManyToOne(() => Status)
  @JoinColumn()
  status: Status

  @OneToMany(() => Like, (like) => like.property, { cascade: [ 'insert' ] })
  @JoinColumn()
  likes: Like[]
}
