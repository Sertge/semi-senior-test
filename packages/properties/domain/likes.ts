import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Property } from './properties'
import { User } from './users'

@Entity({name: 'like'})
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Property, { cascade: [ 'insert' ] })
  @JoinColumn()
  property: number

  @ManyToOne(() => User, { cascade: [ 'insert' ] })
  @JoinColumn()
  user: number
}
