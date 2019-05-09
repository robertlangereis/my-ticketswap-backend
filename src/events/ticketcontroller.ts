import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, Put, Body, Patch} from 'routing-controllers'
// import User from '../users/entity'
import { Ticket, Comment } from './entities'
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
    console.log("ISTHIS 3333???!!!", userTicketCount)
    // console.log("authorId 222 ???", authorIdNum)
    
    
    
    // const ticketnumber = ticket.ticketId
    // console.log(ticketnumber, "ticketId nummer")
  
    const allTickets = await Ticket.find()
    
    const fraudPercentage = calculateFraud(ticket, comments, allTickets, userTicketCount)
    console.log("what does calculateFraud(ticket) return???", calculateFraud(ticket, comments, allTickets, userTicketCount))


    // Run through the comments, check for matches with TiketID
    // deze werkt wel ==> const comments = await Comment.count({ text: "Joejoe" })
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
    console.log("ticketidentification 3.0", ticket)
    ticket && await ticket.save()
    
    
    
    
    
    
    
    ticket.save()
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