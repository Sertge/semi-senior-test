import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Property } from './properties'
import { User } from './users'

@Entity({name: 'like'})
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Property, { eager: true })
  property: Property

  @ManyToOne(() => User, { eager: true })
  user: User
}
