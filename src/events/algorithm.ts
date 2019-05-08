import { Ticket } from './entities'
// import User from '../users/entity'

export const calculateFraud = (ticket: Ticket) => {
  let fraudrisk = ticket.fraudpercentage
  console.log('what is fraudrisk now 1.0?!', fraudrisk)
  const ticketTimeAdded = ticket.timeAdded.toString()
  const hrsString = ticketTimeAdded.split(' ')[4].split(':')[0]
  const hrs = parseInt(hrsString, 10)
  const comments = ticket.comments.length
  // ticket.timeAdded is ISO 8601
  // console.log('what is spacetime ticketTimeAdded?', ticketTimeAdded)
  // console.log('what is spacetime hrsString?', hrsString)
  // console.log('what is spacetime hrs?', hrs)
  if(ticket){
    ticket ? fraudrisk = 5: null
    ticket && comments < 3 ? fraudrisk + 5 : null
    ticket && hrs < 9 && hrs > 17 ? fraudrisk + 6 : null
    ticket && hrs > 9 && hrs < 17 ? fraudrisk - 14 : null
    console.log('what is fraudrisk now 2.0?!', fraudrisk)
    console.log('how many comments does it have?!', comments)
    console.log('what is fraudrisk now 3.0?!', fraudrisk)
  }
  else if (ticket && fraudrisk > 95){
    return fraudrisk = 95
  }
  ticket.save()
  return fraudrisk
    
  
  // ticket.fraudpercentage.save()
    
    // console.log('Ticket zou vijf punten moeten hebben:', ticket)
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