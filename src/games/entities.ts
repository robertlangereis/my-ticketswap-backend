import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = 'x' | 'o'

type Status = 'pending' | 'started' | 'finished'

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column({nullable: true})
  stackorder: number

  @Column('char', {length:1, default: 'x'})
  turn: Symbol

  @Column('char', {length:1, nullable: true})
  winner: Symbol

  @Column('text', {default: 'pending'})
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, {eager: true})
  players: Player[]

  @OneToMany(_ => Card, card => card.game, {eager: true})
  stack: Card[]
}

@Entity()
@Index(['game', 'user', 'symbol'], {unique:true})
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column('char', {length: 1})
  symbol: Symbol

  @Column({nullable: true, default: 20})
  score: number

  // @Column('integer', { name: 'user_id' })
  // userId: number

  @OneToMany(_ => Card, card => card.player, {eager: true})
  hand: Card[]
}

@Entity('cards', { orderBy: { ordernumber: 'ASC' }})
export class Card extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id?: number

  @Column({nullable: true})
  ordernumber: number

  @Column()
  color: string

  @Column()
  points: number

  @Column({nullable: true})
  symbol: Symbol

  @ManyToOne(_ => Player, player => player.hand, {nullable: true})
  player: Player | null

  @ManyToOne(_ => Game, game => game.stack)
  game: Game
}


