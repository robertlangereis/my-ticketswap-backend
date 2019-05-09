import { Ticket } from './entities'
// import User from '../users/entity'

export const calculateFraud = (ticket: Ticket) => {
  let fraudrisk = ticket.fraudpercentage
  const ticketTimeAdded = ticket.timeAdded.toString()
  // ticket.timeAdded is ISO 8601
  console.log('what is spacetime ticketTimeAdded?', ticketTimeAdded)
  const hrsString = ticketTimeAdded.split(' ')[4].split(':')[0]
  console.log('what is spacetime hrsString?', hrsString)
  const hrs = parseInt(hrsString, 10)
  console.log('what is spacetime hrs?', hrs)
  // const comments = ticket.comments.length
  const comments = 4
  if(ticket) fraudrisk = 5
  if (ticket){
    console.log('what is fraudrisk now 1.0?!', fraudrisk)
    if (hrs < 9 || hrs > 17){
      fraudrisk = fraudrisk + 10
      console.log('what is fraudrisk now 2.0 - TIME?!', fraudrisk)
      ticket.save()
    }
    else if (hrs > 9 || hrs < 17){
      fraudrisk = fraudrisk -10
      ticket.save()
    }
  }
  if(ticket){
    if(comments > 3){
      fraudrisk = fraudrisk + 5
      console.log('babylon?!', fraudrisk)
      ticket.save()
    }
  }
  if(ticket){
    if (fraudrisk > 95) {
      fraudrisk = 95
      console.log('moet niet vuren!', fraudrisk)
      ticket.save()
    }
  }
    ticket.save()
    console.log('what is FINAL fraudrisk?!', fraudrisk)
    console.log('what is FINAL ticket now 3.0?!', ticket)
    return fraudrisk
  }
  
