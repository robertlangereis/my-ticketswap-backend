import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Event, Ticket, Comment } from './entities'
// import {calculateWinner, generateRandomCard, calculatePoints} from './logic'
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
    // console.log(events)
    return events
  }

  // GET EVENT BY ID
  @Get('/events/:id')
  async getEvent(@Param('id') id: any): Promise<Event> {
    const event = await Event.findOneById(id)
    if (!event) throw new NotFoundError('Cannot find event')
    console.log(event)
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