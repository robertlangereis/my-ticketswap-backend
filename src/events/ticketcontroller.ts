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
  
  // // GET ALL TICKETS
  // @Get('/events/:id/tickets')
  //   async allTickets(
  //   @Param('id') id: number,
  // ): Promise<TicketList> {
  //   const tickets = await Ticket.find()
  //   // console.log(tickets)
  //   return tickets
  // }

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
    // console.log("ISTHIS 3333???!!!", userTicketCount)
    // console.log("authorId 222 ???", authorIdNum)
    
    // const ticketnumber = ticket.ticketId
    // console.log(ticketnumber, "ticketId nummer")
    
    // console.log("what does calculateFraud(ticket) return???", calculateFraud(ticket, comments, allTickets, userTicketCount))
    // ticket && console.log(comments, "benieuwd")  
  
    if(ticket){ticket.fraudpercentage=fraudPercentage}
    // comments.map(comment => comment.ticketId === ticket.id)
    // comments && calculateCommentsFraud(comments, ticket)
  // comments returns an array of objects, so it can be mapped
      
  // Run through all tickets, check for the average price. Adjust risk accordingly
      // const tickets = await Ticket.find()
  // tickets returns an array of objects, so it can be mapped
    //
    // const events = await Event.find()
    // console.log("ticketidentification 3.0", ticket)
    ticket && await ticket.save()
    // ticket.save()
    return ticket
  }

  // CREATE TICKET
  @Authorized()
  @Post('events/:eventId/tickets')
  @HttpCode(201)
  async createTicket(
    @Param('eventId') eventId: number,
    @Body() ticket: Ticket,
    @CurrentUser() user: User
  ): Promise<Ticket> {
    const event = await Event.findOneById(eventId)
    if (!event) throw new NotFoundError('Cannot find event')
    // console.log("incoming. Ticket data is:", ticket)
    const {price, ticketDescription, imageUrl, dateAdded} = ticket
    const entity = await Ticket.create({
      price, 
      ticketDescription, 
      imageUrl, 
      dateAdded,
      user,
      event
    }).save()
    console.log("incoming entity is:", entity)
    const newTicket = await Ticket.findOneById(entity.ticketId)
    io.emit('action', {
      type: 'ADD_TICKET',
      payload: newTicket
    })
    return newTicket  
  }


  // UPDATE TICKET BY ID
  @Put('events/:id/tickets/:ticketid')
  async updateTicket(
  @Param('ticketid') ticketid: any,
  @Body() update: Partial<Ticket>
  ) {
  const ticket = await Ticket.findOne(ticketid)
  if (!ticket) throw new BadRequestError('Ticket does not exist')
  return Ticket.merge(ticket, update).save()
  }
}