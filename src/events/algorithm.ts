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
      fraudrisk = fraudrisk -30
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
    
  // ticket.fraudpercentage.save()
    // console.log('Ticket zou vijf punten moeten hebben:', ticket)
  // player.score = 20
  // let isValid: boolean = true
  // console.log("stack test calculatePoints", game.stack)

  // if (!gameStack && !opponent) return null
  // gameStack.map( card => {
  //   console.log("points test: ", player.score, opponent && opponent.score)
  //   console.log('card test:', card)
  //   if (!isValid) {
  //     return isValid = true
  //   } else if (opponent) {
  //     console.log('card.color test:', card.color)
  //     switch (card.color) {
  //       case "red":
  //         console.log('red test!')
  //         if (card.symbol === player.symbol) {
  //           opponent.score = opponent.score - card.points
  //         } else {
  //           player.score = player.score - card.points
  //         }
  //         break;
        
  //       case "green":
  //         console.log('green test!')
  //         if (card.symbol === player.symbol) {
  //           player.score = player.score + card.points
  //         }
  //         else {
  //           opponent.score = opponent.score + card.points
  //         }
  //         break;
        
  //       case "blue":
  //         isValid = false
  //         break;
        
  //       case "black":
  //         if (card.symbol === player.symbol) {
  //           opponent.score = (opponent.score = Math.floor(opponent.score / 2))
  //         } else {
  //           player.score = player.score = Math.floor(player.score / 2)
  //         }
  //         break;
        
  //       case "purple":
  //         if (card.symbol === player.symbol) {
  //           player.score = player.score = Math.floor(player.score * 2)
  //         }  else {
  //           opponent.score = (opponent.score = Math.floor(opponent.score * 2))
  //         }
  //         break;
  //     }
      
  //   }
  // })
  // player.save()
  // opponent && opponent.save()
// }