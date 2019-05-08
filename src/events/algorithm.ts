import { Ticket } from './entities'
// import User from '../users/entity'

export const calculateFraud = (ticket: Ticket) => {
  // const ticketTimeAdded = ticket.timeAdded.getHours()
  console.log('Ticket zou nul punten moeten hebben:', ticket)
  ticket.fraudpercentage + 5
  ticket.save()
  console.log('fraudrisk vijf punten moeten hebben:', ticket)
  const comments = ticket.comments.length 
  // console.log('how many comments does it have?!', comments)
    if(ticket){
    if(comments < 3){
    ticket.fraudpercentage + 5
    }
    // else if(ticketTimeAdded < 09 && ticketTimeAdded > 17){
    // return fraudrisk + 10
    // }
    // else if(ticketTimeAdded > 09 && ticketTimeAdded < 17){
    // return fraudrisk + 10}
    else if (ticket.fraudpercentage > 95) {
      ticket.fraudpercentage = 95
    }
    else ticket.fraudpercentage = 5
    }
    ticket.save()
    // return ticket
  }
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