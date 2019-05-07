import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
import User from '../users/entity'
import { Ticket } from './entities'
// import {calculateWinner, generateRandomCard, calculatePoints} from './logic'
import {io} from '../index'

type TicketList = Ticket[]

// this makes sure a class is marked as controller that always returns JSON
// perfect for our REST API
@JsonController()
export default class TicketController {
  
  // GET ALL EVENTS
  @Get('/events/tickets')
  async allTickets(): Promise<TicketList> {
    const tickets = await Ticket.find()
    // console.log(tickets)
    return tickets
  }

  // GET EVENT BY ID
  @Get('/events/:id/tickets/:id')
  async getTicket(@Param('id') id: any): Promise<Ticket> {
    const ticket = await Ticket.findOneById(id)
    if (!ticket) throw new NotFoundError('Cannot find ticket')
    console.log("ticket in GET server side", ticket)
    return ticket
  }

  // CREATE EVENT
  @Authorized()
  @Post('events/tickets')
  @HttpCode(201)
  async createGame(
    @Body() ticket: Ticket
  ) {
    await Ticket.create().save()
    
    io.emit('action', {
      type: 'ADD_EVENT',
      payload: ticket
    })

    return ticket  
  }
}

  // UPDATE EVENT BY ID
  // @Put('/tickets/:id')
  // async updateTicket(
  // @Param('id') id: any,
  // @Body() update: Partial<TicketList>
  // ) {
  // const ticket = await Ticket.findOne(id)
  // if (!ticket) throw new BadRequestError('Ticket does not exist')

  // return Ticket.merge(ticket, update).save()
  // }