import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Event, Ticket, Comment } from './entities'
import {calculateFraud, calculateCommentsFraud} from './algorithm'
import {io} from '../index'

type EventList = Event[]

// this makes sure a class is marked as controller that always returns JSON
// perfect for our REST API
@JsonController()
export default class EventController {
  
  // GET ALL EVENTS
  @Get('/events')
  async allEvents(): Promise<EventList> {
    const events = await Event.find()
    console.log(events, "how do events lookyliky")
    return events
  }

  // GET EVENT BY ID
  @Get('/events/:id')
  async getEvent(@Param('id') id: any): Promise<Event> {
    const event = await Event.findOneById(id)
    if (!event) throw new NotFoundError('Cannot find event')
                    //   const ticket = await Ticket.findOneById(id)
                    //   ticket && calculateFraud(ticket)
                    // // Run through the comments, check for matches with TiketID
                    // // deze werkt wel ==> const comments = await Comment.count({ text: "Joejoe" })
                    //   const comments = await Comment.findAndCount({where: { ticket: ticket!.ticketId }})
                    //   ticket && console.log(ticket.ticketId, "ticketId nummer")
                    //   ticket && console.log(comments, "benieuwd")
                    //   // comments.map(comment => comment.ticketId === ticket.id)
                    //   // comments && calculateCommentsFraud(comments, ticket)
                    // // comments returns an array of objects, so it can be mapped
                        
                    // // Run through all tickets, check for the average price. Adjust risk accordingly
                    //     // const tickets = await Ticket.find()
                    // // tickets returns an array of objects, so it can be mapped
                    //   //
                    //   // const events = await Event.find()
                    //   console.log("ticketidentification 3.0", ticket)
                    //   ticket && await ticket.save()
    return event
  }

  // CREATE EVENT
  @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createGame(
    @Body() event: Event
  ) {
    await Event.create().save()
    
    io.emit('action', {
      type: 'ADD_EVENT',
      payload: event
    })

    return event  
  }
}

  // UPDATE EVENT BY ID
  // @Put('/events/:id')
  // async updateEvent(
  // @Param('id') id: any,
  // @Body() update: Partial<EventList>
  // ) {
  // const event = await Event.findOne(id)
  // if (!event) throw new BadRequestError('Event does not exist')

  // return Event.merge(event, update).save()
  // }