import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Event } from './entities'
import {io} from '../index'

type EventList = Event[]

@JsonController()
export default class EventController {
  
  // GET ALL EVENTS
  @Get('/events')
  async allEvents(): Promise<EventList> {
    const events = await Event.find()
    return events
  }

  // GET EVENT BY ID
  @Get('/events/:id')
  async getEvent(
    @Param('id') id: any
    ): Promise<Event> {
    const event = await Event.findOneById(id)
    if (!event) throw new NotFoundError('Cannot find event')
    return event
  }

  // CREATE EVENT
  @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createEvent(
    @Body() data: Event,
    @CurrentUser() user: User): Promise<Event> {
      
    const {eventName, eventDescription, image_url, start_date, end_date } = data
    !await user.password
    const entity = await Event.create({
      eventName, 
      eventDescription, 
      image_url, 
      start_date,
      end_date,
      user
    }).save()
    const newEvent = await Event.findOneById(entity.eventId)
    
    // io.emit('action', {
    //   type: 'ADD_EVENT',
    //   payload: newEvent
    // })
    return newEvent!
  }
  
  // UPDATE EVENT BY ID
  @Authorized()
  @Patch('/events/:id')
  async updateEvent(
    @Param('id') eventId: any,
    @CurrentUser() user: User,
    @Body() update: Partial<Event>
    ) {
      const event = await Event.findOneById(eventId)
      console.log(update, "update")
      console.log(event, "event")
      if (!event) throw new BadRequestError('Event does not exist')
      if (event.user.userId === user.userId) return await Event.merge(event, update).save()
      else throw new BadRequestError('You cannot edit this event, as you are not the owner of the event')
    }
  }