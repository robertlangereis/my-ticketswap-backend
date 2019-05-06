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
  
  @Get('/events')
  async allEvents(): Promise<EventList> {
    const events = await Event.find()
    return { events }
  }

  @Get('/events/:id')
  getEvent(
      @Param('id') id: any
  ) {
    Event.findOne(id)
  }


  @Put('/events/:id')
  async updateEvent(
  @Param('id') id: any,
  @Body() update: Partial<EventList>
  ) {
  const event = await Event.findOne(id)
  if (!event) throw new NotFoundError('Cannot find event')

  return Event.merge(event, update).save()
  }
  
  @Authorized()
  @Post('/events')
  @HttpCode(201)
  createEvent(
    @Body() event: Event
  ) {
    return event.save()
  }
}

  @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createEvent(
    @CurrentUser() user: User
  ) {
    const entity = await Event.create().save()

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

  @Authorized()
  @Post('/events/:id([0-9]+)/tickets')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') eventId: number
  ) {
    const event = await Event.findOneById(eventId)
    if (!event) throw new BadRequestError(`Event does not exist`)

    event.status = 'started'
    await event.save()

    const ticket = await Ticket.create({
      event, 
      user,
      comment: [cardOne, cardTwo, cardThree]
    }).save()
    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Event.findOneById(event.id)
    })

    return ticket
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch('/events/:id([0-9]+)')
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() update: GameUpdate
  ) {
    const event = await Event.findOneById(gameId)
    if (!event) throw new NotFoundError(`Event does not exist`)

    const ticket = await Ticket.findOne({ user, event })

    if (!ticket) throw new ForbiddenError(`there are no tickets available for this event`)
    // if (event.status !== 'started') throw new BadRequestError(`The event is not started yet`)

    // replacing the comment played with a new comment
    const newCard = await Comment.create(generateRandomCard(ticket.symbol)).save()
    ticket.hand = ticket.hand.map(handCard => {
      const isMatch = handCard.id === update.cardId
      if (isMatch) {
        return newCard
      }
      return handCard
    })
    await ticket.save()

    // putting the comment played into the event.stack
    const comment = await Comment.findOneById(update.cardId)
    if(comment){
      // console.log("comment before ordernumber added", comment)
      event.stackorder ++
      comment.ordernumber = event.stackorder
      // console.log("stackorder before", event.stackorder)
      // console.log("cardordernumber before.", comment.ordernumber)
      // console.log("stackorder after incr.", event.stackorder)
      // console.log("cardordernumber after incr.", comment.ordernumber)
      // console.log("comment after ordernumber added", comment)
      await comment.save()
      event.stack.push(comment)
    }
    await event.save()
    // console.log("update event find comment test: ", comment)
    // console.log("stack test one: ", event.stack)

    const newGame = await Event.findOneById(gameId)
    if (!newGame) throw new NotFoundError(`Event does not exist`)

    // newGame.stack = newGame.stack.sort(comment => comment.ordernumber.sort())
    const newStack = newGame
      .stack
      .sort((a, b) => (a.ordernumber < b.ordernumber) ? 1 : -1)

    newGame.stack = newStack

    calculatePoints(newGame, ticket)
    console.log('after calc tickets test:', newGame.tickets)
    
    await ticket.save()
    console.log("after points calc na Ticket save: ", newGame.tickets)
    await newGame.save()
    console.log("after points calc newGame save: ", newGame.tickets)

    const finalEvent = await Event.findOneById(gameId)
    if (!finalEvent) throw new NotFoundError(`Event does not exist`)
    
    console.log("final event scores test: ", finalEvent.tickets)
    
    const finalStack = finalEvent
      .stack
      .sort((a, b) => (a.ordernumber > b.ordernumber) ? 1 : -1)

    finalEvent.stack = finalStack

    const winner = calculateWinner(ticket, finalEvent)
    if (winner) {
      finalEvent.winner = winner
      finalEvent.status = 'finished'
    } else {
      finalEvent.turn = ticket.symbol === 'x' ? 'o' : 'x'
    }
    await finalEvent.save()
    
    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: finalEvent
    })

    return finalEvent
  }

  @Authorized()
  @Get('/events/:id([0-9]+)')
  getGame(
    @Param('id') id: number
  ) {
    return Event.findOneById(id)
  }

  @Authorized()
  @Get('/events')
  getGames() {
    return Event.find()
  }
}