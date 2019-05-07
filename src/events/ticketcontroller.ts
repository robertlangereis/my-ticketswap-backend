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
  
  // GET ALL TICKETS
  @Get('/events/:eventId/tickets')
  async allTickets(): Promise<TicketList> {
    const tickets = await Ticket.find()
    // console.log(tickets)
    return tickets
  }

  // GET TICKET BY ID
  @Get('/events/:eventId/tickets/:id')
  async getTicket(@Param('id') id: number): Promise<Ticket> {
    console.log("what is the id for @GET", id)
    const ticket = await Ticket.findOneById(id)
    if (!ticket) throw new NotFoundError('Cannot find ticket')
    console.log("ticket in GET server side", ticket)
    return ticket
  }

  // CREATE TICKET
  @Authorized()
  @Post('events/tickets')
  @HttpCode(201)
  async createGame(
    @Body() ticket: Ticket
  ) {
    await Ticket.create().save()
    
    io.emit('action', {
      type: 'ADD_TICKET',
      payload: ticket
    })

    return ticket  
  }
}

  // UPDATE TICKET BY ID
  // @Put('/tickets/:id')
  // async updateTicket(
  // @Param('id') id: any,
  // @Body() update: Partial<TicketList>
  // ) {
  // const ticket = await Ticket.findOne(id)
  // if (!ticket) throw new BadRequestError('Ticket does not exist')

  // return Ticket.merge(ticket, update).save()
  // }