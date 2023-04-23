import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

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
}