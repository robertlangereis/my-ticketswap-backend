import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne} from 'typeorm'
import { MinLength, IsString, MaxLength, Length, IsDate } from 'class-validator';
import User from '../users/entity'
// import { text } from 'body-parser';

@Entity()
export class Event extends BaseEntity {

  @PrimaryGeneratedColumn()
  eventId?: number
  
  @IsString()
  @MinLength(1)
  @Column()
  eventName: string

  @IsString()
  @MaxLength(300)
  @Column()
  eventDescription: string

  @IsString()
  @Column()
  image_url: string

  @IsDate()
  @Column()
  start_date: string

  @IsDate()
  @Column()
  end_date: string

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Ticket, ticket => ticket.event, {eager: true})
  tickets: Ticket[]
  
  @ManyToOne(_ => User, user => user.events)
  user: User
}

@Entity()
// @Index(['event'], {unique:true})
//ticket is unique to an event and unique to a user
export class Ticket extends BaseEntity {

  @PrimaryGeneratedColumn()
  ticketId?: number
  
  @IsString()
  @Column({nullable: true})
  imageUrl: string

  @Column()
  price: number

  @IsString()
  @MaxLength(300)
  @Column()
  ticketDescription: string

  // implementation of game-logic. But, instead of game-logic we have the calculation of the alogorithm. So, using the game-logic as a base to calculate the fraud percentage?....
  @Column({nullable: true})
  fraudpercentage: number

  //sketchy, weet niet of dit werkt maar zou wel makkelijk zijn: https://github.com/typeorm/typeorm/issues/877
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  timeAdded: string;

  @IsDate()
  @Column()
  dateAdded: string

  @OneToMany(_ => Comment, comment => comment.ticket, {
    // eager: true, 
    cascadeUpdate: true
  })
  comments: Comment[]

  @ManyToOne(_ => User, user => user.tickets)
  user: User
  
  @ManyToOne(_ => Event, event => event.tickets)
  event: Event
}

@Entity()
//comment is unique to a ticket
export class Comment extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  commentId?: number

  @IsString()
  @Length(3, 300)
  @Column('text')
  text: string

  @ManyToOne(_ => Ticket, ticket => ticket.comments,{ eager: true, onDelete: 'CASCADE'})
  ticket: Ticket
  
  @ManyToOne(_ => User, user => user.comments)
  user: User
}


