import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({name: 'users'})
export class UserPassword {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string
}
