import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
// import User from '../users/ennpmtity'
import { Ticket, Comment, Event } from './entities'
import User from '../users/entity'
import {calculateFraud} from './algorithm'
import {io} from '../index'

// type TicketList = Ticket[]

// this makes sure a class is marked as controller that always returns JSON
// perfect for our REST API
@JsonController()
export default class TicketController {

  // GET TICKET BY ID
  @Get('/events/:id/tickets/:ticketid')
  async getTicket(@Param('ticketid') ticketid: number): Promise<Ticket> {
    // console.log("what is the id for @GET", id)
    const ticket = await Ticket.findOneById(ticketid)
    if (!ticket) throw new NotFoundError('Cannot find ticket')
    const comments = await Comment.count({where: { ticket: ticketid }})
    // console.log("commentsId???", comments)
    const authorId = await Ticket.find({where: { ticketId: ticketid }, relations: ["user"] })
    const authorIdNum = authorId.map(ticket => ticket.user.userId)[0]
    const userTicketCount = await Ticket.count({where: { user: authorIdNum }})
    const allTickets = await Ticket.find()
    const fraudPercentage = calculateFraud(ticket, comments, allTickets, userTicketCount)
    
    ticket.fraudpercentage = fraudPercentage
    await ticket.save()

    return ticket
  }

  // CREATE TICKET
  @Authorized()
  @Post('/events/:eventId/tickets')
  @HttpCode(201)
  async createTicket(
    @Param('eventId') eventId: any,
    @Body() data: any,
    @CurrentUser() user: User
  ) {
    console.log("incoming. Ticket data is:", data)
    const event = await Event.findOneById(eventId)
    console.log("incoming. event of new Ticket is:", event)
    if (!event) throw new NotFoundError('Cannot find event')
    const {price, ticketDescription, imageUrl} = data
    !await user.password
    const entity = await Ticket.create({
      price, 
      ticketDescription, 
      imageUrl, 
      user,
      event
    }).save()
    // console.log("incoming entity is:", entity)
    const newTicket = await Ticket.findOneById(entity.ticketId)
    
    io.emit('action', {
      type: 'ADD_TICKET',
      payload: newTicket
    })
    return newTicket!
  }


  // UPDATE TICKET BY ID
  @Authorized()
  @Put('/events/:id/tickets/:ticketid')
  async updateTicket(
  @Param('ticketid') ticketid: any,
  @CurrentUser() user: User,
  @Body() update: Partial<Ticket>
  ) {
  const ticket = await Ticket.findOneById(ticketid)
  if (!ticket) throw new BadRequestError('Ticket does not exist')
  if (ticket!.user === user) return Ticket.merge(ticket!, update).save()
  else throw new BadRequestError('You cannot edit this ticket, as you are not the owner of the ticket')
  }
}