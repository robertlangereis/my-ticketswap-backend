import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { MinLength, IsString, MaxLength, Length } from "class-validator";
import User from "../users/entity";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  eventId?: number;

  @IsString()
  @MinLength(1)
  @Column()
  eventName: string;

  @IsString()
  @MaxLength(300)
  @Column()
  eventDescription: string;

  @IsString()
  @Column()
  image_url: string;

  @IsString()
  @Column()
  start_date: string;

  @IsString()
  @Column()
  end_date: string;

  @OneToMany(_ => Ticket, ticket => ticket.event, { eager: true })
  tickets: Ticket[];

  @ManyToOne(_ => User, user => user.events, { eager: true })
  user: User;
}

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer" })
  ticketId?: number;

  @IsString()
  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  price: number;

  @IsString()
  @MaxLength(300)
  @Column()
  ticketDescription: string;

  @Column({ nullable: true, default: 5 })
  fraudpercentage: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    nullable: true,
  })
  timeAdded: string;

  @OneToMany(_ => Comment, comment => comment.ticket, {
    cascadeUpdate: true,
  })
  comments: Comment[];

  @ManyToOne(_ => User, user => user.tickets)
  user: User;

  @ManyToOne(_ => Event, event => event.tickets)
  event: Event;
}

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  commentId?: number;

  @IsString()
  @Length(2, 300)
  @Column("text")
  text: string;

  @ManyToOne(_ => Ticket, ticket => ticket.comments, {
    eager: true,
    onDelete: "CASCADE",
  })
  ticket: Ticket;

  @ManyToOne(_ => User, user => user.comments)
  user: User;
}
