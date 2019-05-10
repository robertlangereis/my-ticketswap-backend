import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Event } from './entities'
import {io} from '../index'

type EventList = Event[]

@JsonController()
export default class EventController {
  
  // GET ALL EVENTS
  // @Authorized()
  @Get('/events')
  async allEvents(): Promise<EventList> {
    const events = await Event.find()
    // if (!event) throw new NotFoundError('Cannot find event')
    // console.log(events, "how do events lookyliky")
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
  // @HttpCode(201)
  async createEvent(
    @Body() data: Event,
    // @CurrentUser() user: User
    ){
      const {eventName, eventDescription, image_url, start_date, end_date } = data
      console.log("incoming eventcreated", data)
  // : Promise<Event> {
    console.log("incoming eventcreated")
    const entity = await Event.create({
      eventName, 
      eventDescription, 
      image_url, 
      start_date,
      end_date,
      // user
    }).save()
    console.log("incoming entity", entity)
    const newEvent = await Event.findOneById(entity.eventId)

    io.emit('action', {
      type: 'ADD_EVENT',
      payload: newEvent
    })
    return newEvent!  
    // if(newEvent) return newEvent.save()
  }
  
  // UPDATE EVENT BY ID
  @Authorized()
  @Patch('/events/:id')
  async updateEvent(
    @Param('id') eventId: any,
    @Body() update: Partial<Event>,
    ) {
      const event = await Event.findOne(eventId)
      if (!event) throw new BadRequestError('Event does not exist')
      
      return Event.merge(event, update).save()
    }
  }