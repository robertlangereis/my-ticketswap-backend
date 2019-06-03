# TicketSwap rebuild - Robert Langereis

*NOTE THIS PROJECT IS STILL IN DEVELOPMENT*
*We had 5 days to finish this final assignment, building both the backend and frontend (to be found here: https://github.com/robertlangereis/my-ticketswap-frontend)*

This is the backend (REST API) for a Ticketswap lookalike (main functionality), by Robert Langereis, as a final (individual) assignment for the Codaisseur Academy. For this REST API I used the following dev tech:
- Postgres, TypeORM & Koa (instead of express)

# Interesting features
* You can register and login as a user
* As a user you can create new events, for which you can add tickets (to be sold - but feature to sell not implemented)
* The most interesting feature was the showing of the "risk of fraud" a certain tickets has when it is on sale. The calculation of the fraud risk is done in the backend (for obvious security reasons) and calculates the following:
    1. If the ticket is the only ticket of the author, add 10%
    2. if the ticket price is lower than the average ticket price for that event, that's a risk
    3. if a ticket is X% cheaper than the average price, add X% to the risk
    4. if a ticket is X% more expensive than the average price, deduct X% from the risk, with a maximum of 10% deduction
    5. if the ticket was added during business hours (9-17), deduct 10% from the risk, if not, add 10% to the risk
    6. if there are >3 comments on the ticket, add 5% to the risk
    7. The minimal risk is 5% (there's no such thing as no risk) and the maximum risk is 95%.
    

## Instal & Running the REST API yourself
* You need a working Postgres database that is preferrably empty (drop all the tables) and running 
* Install the dependencies using `npm install`
* `npm run dev` to start the app
* This backend requires a frontend that can be found here (deployed on Netlify: ): https://github.com/robertlangereis/my-ticketswap-frontend

# This REST API has the following endpoints:

* `POST /users`: sign up as new user
* `POST /logins`: log in and receive a JWT
* `POST /events`: create a new event 
* `PATCH /events/:id`: update an existing event
* `GET /events`: list all games
* `POST /events/:id/tickets`: create a new ticket for an event 
* `PATCH /events/:id/tickets`: update an existing ticket for an event 
