import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Event, Ticket, Comment } from './entities'
import {calculateWinner, generateRandomCard, calculatePoints} from './logic'
import {io} from '../index'

type EventList = { events: Event[] }

// this makes sure a class is marked as controller that always returns JSON
// perfect for our REST API
@JsonController()
export default class EventController {
  
  // GET ALL EVENTS
  @Get('/events')
  async allEvents(): Promise<EventList> {
    const events = await Event.find()
    return { events }
  }

  // GET EVENT BY ID
  @Get('/events/:id')
  getEvent(
      @Param('id') id: number
  ) {
    return Event.findOneById(id)
  }

  // CREATE EVENT
  @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User
  ) {
    await Event.create().save()
    
    io.emit('action', {
      type: 'ADD_EVENT',
      payload: event
    })

    return event  
  }

  // UPDATE EVENT BY ID
  // @Put('/events/:id')
  // async updateEvent(
  // @Param('id') id: any,
  // @Body() update: Partial<EventList>
  // ) {
  // const event = await Event.findOne(id)
  // if (!event) throw new NotFoundError('Cannot find event')

  // return Event.merge(event, update).save()
  // }
  
  @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createEvent(
    // @CurrentUser() user: User
    @Body() event: Event
  ) {
    const entity = await Event.create().save()
    }
  }


    await Ticket.create({
      event: entity, 
      user,
      comment
    }).save()

    const event = await Event.findOneById(entity.id)

    io.emit('action', {
      type: 'ADD_EVENT',
      payload: event
    })

    return event

}