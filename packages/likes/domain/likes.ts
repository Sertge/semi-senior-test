import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int4' })
  property: number

  @Column({ type: 'int4' })
  user: number
}