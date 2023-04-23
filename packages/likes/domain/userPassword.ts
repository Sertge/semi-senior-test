import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'

@Entity({name: 'users'})
export class UserPassword {
  @PrimaryColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string
}
