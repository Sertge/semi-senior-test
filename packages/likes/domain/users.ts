import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import { Like } from './likes'

@Entity({name: 'user'})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  email: string

  @Column()
  is_active: boolean

  @OneToMany(() => Like, (like) => like.user, {cascade: ['insert']} )
  @JoinColumn()
  like: Like[]
}
