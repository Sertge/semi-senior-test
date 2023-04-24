import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'

@Entity({ name: 'status' })
export class Status {
  @PrimaryGeneratedColumn({ type: 'int4' })
  id: number

  @Column()
  name: string

  @Column()
  label: string
}