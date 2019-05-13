import { Ticket } from './entities'
// import User from '../users/entity'

export const calculateFraud = (ticket: Ticket, comments: number, allTickets:Ticket[], userTicketCount: number) => {
  let fraudrisk = ticket.fraudpercentage
  // ticket.timeAdded is ISO 8601, converted to String
  
  const ticketTimeAdded = ticket.timeAdded.toString()
  const hrsString = ticketTimeAdded.split(' ')[4].split(':')[0]
  const hrs = parseInt(hrsString, 10)

  const avgPriceAllTickets = allTickets.reduce((a,b) => a + b.price, 0) / allTickets.length
  const percPrice = (((avgPriceAllTickets - ticket.price) / ticket.price)*100).toFixed(0)
  const percPriceNum = Number(percPrice)
  
  if(ticket) fraudrisk = 5
  if (ticket){
    if (hrs < 9 || hrs > 17){
      fraudrisk = fraudrisk + 10
      ticket.save()
    }
    else if (hrs > 9 || hrs < 17){
      fraudrisk = fraudrisk - 10
    }
  }
  if (ticket){
    if (userTicketCount === 1){
      fraudrisk = fraudrisk + 10
    }
  }
  if(ticket){
    if(percPriceNum < 0){
      fraudrisk = fraudrisk - percPriceNum
    }
    else if (percPriceNum > 0){
      fraudrisk = fraudrisk + percPriceNum
    }
  }
  if(ticket){
    if(comments > 3){
      fraudrisk = fraudrisk + 5
    }
  }
  if(ticket){
    if (fraudrisk > 95) {
      fraudrisk = 95
    }
  }
  if(ticket){
    if (fraudrisk < 5) {
      fraudrisk = 5
    }
  }
    ticket.save()
    return fraudrisk
  }