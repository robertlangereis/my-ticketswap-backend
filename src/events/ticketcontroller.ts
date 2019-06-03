import {
  JsonController,
  Authorized,
  CurrentUser,
  Post,
  Param,
  BadRequestError,
  HttpCode,
  NotFoundError,
  Get,
  Body,
  Patch,
} from "routing-controllers";
import { Ticket, Comment, Event } from "./entities";
import User from "../users/entity";
import { calculateFraud } from "./algorithm";

// this makes sure a class is marked as controller that always returns JSON
@JsonController()
export default class TicketController {
  // GET TICKET BY ID
  @Get("/events/:id/tickets/:ticketid")
  async getTicket(@Param("ticketid") ticketid: number): Promise<Ticket> {
    const ticket = await Ticket.findOneById(ticketid);
    if (!ticket) throw new NotFoundError("Cannot find ticket");
    const comments = await Comment.count({ where: { ticket: ticketid } });
    const authorId = await Ticket.find({
      where: { ticketId: ticketid },
      relations: ["user"],
    });
    const authorIdIndex = authorId.map(ticket => ticket.user.userId)[0];
    const userTicketCount = await Ticket.count({
      where: { user: authorIdIndex },
    });
    const allTickets = await Ticket.find();
    // the calculateFraud function below refers to a basic algorithm (in the algorithm.ts file), where the fraud percentage of a ticket is calculated using the input below. So, every time the ticket is requested, this fraud percentage is (re)calculated 
    const fraudPercentage = calculateFraud(
      ticket,
      comments,
      allTickets,
      userTicketCount
    );
    ticket.fraudpercentage = fraudPercentage;
    await ticket.save();

    return ticket;
  }

  // CREATE TICKET
  @Authorized()
  @Post("/events/:eventId/tickets")
  @HttpCode(201)
  async createTicket(
    @Param("eventId") eventId: any,
    @Body() data: any,
    @CurrentUser() user: User
  ) {
    const event = await Event.findOneById(eventId);
    if (!event) throw new NotFoundError("Cannot find event");
    const { price, ticketDescription, imageUrl } = data;
    !(await user.password);
    const entity = await Ticket.create({
      price,
      ticketDescription,
      imageUrl,
      user,
      event,
    }).save();
    const newTicket = await Ticket.findOneById(entity.ticketId);
    return newTicket!;
  }

  // UPDATE TICKET BY ID
  @Authorized()
  @Patch("/events/:id/tickets/:ticketid")
  async updateTicket(
    @Param("ticketid") ticketid: any,
    @CurrentUser() user: User,
    @Body() update: Partial<Ticket>
  ) {
    const ticket = await Ticket.findOneById(ticketid);
    if (!ticket) throw new BadRequestError("Ticket does not exist");
    if (ticket!.user === user)
      return await Ticket.merge(ticket!, update).save();
  }
}
