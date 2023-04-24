import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Property } from './properties'
import { User } from './users'

@Entity({name: 'like'})
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Property, { cascade: [ 'insert', 'remove' ] })
  @JoinColumn()
  property: number

  @ManyToOne(() => User, { cascade: [ 'insert', 'remove' ] })
  @JoinColumn()
  user: number
}
