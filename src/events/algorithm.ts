import { Ticket } from './entities'
// import User from '../users/entity'

export const calculateFraud = (ticket: Ticket, comments: number, allTickets:Ticket[]) => {
  let fraudrisk = ticket.fraudpercentage
  const ticketTimeAdded = ticket.timeAdded.toString()
  // ticket.timeAdded is ISO 8601


  const allTicketPriceAvg = allTickets.reduce((a,b) => a + b.price, 0) / allTickets.length
  // console.log(allTicketPriceAvg, "allTicketPriceAvg")
  // console.log(ticket.price, "ticket.price")
  // const percPrice = (allTicketPriceAvg - ticket.price) / ticket.price
  const percPrice = (((allTicketPriceAvg - ticket.price) / ticket.price)*100).toFixed(0)
  const percPriceNum = Number(percPrice)
  console.log(percPriceNum, "percPriceNum")

  // console.log('what is spacetime ticketTimeAdded?', ticketTimeAdded)
  const hrsString = ticketTimeAdded.split(' ')[4].split(':')[0]
  // console.log('what is spacetime hrsString?', hrsString)
  const hrs = parseInt(hrsString, 10)
  // console.log('what is spacetime hrs?', hrs)
  // const comments = ticket.comments.length
  
  
  if(ticket) fraudrisk = 5
  if (ticket){
    if (hrs < 9 || hrs > 17){
      fraudrisk = fraudrisk + 10
    }
    else if (hrs > 9 || hrs < 17){
      fraudrisk = fraudrisk -10
    }
  }
  if(ticket){
    if(percPriceNum > 0){
      fraudrisk = fraudrisk - percPriceNum
    }
    else if (percPriceNum < 0){
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
    if (fraudrisk < 0) {
      fraudrisk = 5
    }
  }
    ticket.save()
    console.log('what is FINAL fraudrisk?!', fraudrisk)
    console.log('what is FINAL ticket now 3.0?!', ticket)
    return fraudrisk
  }