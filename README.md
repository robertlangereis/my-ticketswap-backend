# TicketSwap rebuild - Robert Langereis

This is a server for the replica rebuilt, by Robert Langereis, as a final assignment for the Codaisseur Academy. 

It has these endpoints:

* `POST /users`: sign up as new user
* `POST /logins`: log in and receive a JWT
* `POST /events`: create a new event 
* `PATCH /events/:id`: update an existing event
* `GET /events`: list all games
* `POST /events/:id/tickets`: create a new ticket for an event 
* `PATCH /events/:id/tickets`: update an existing ticket for an event 

## Running

* You need a working Postgres database that is preferrably empty (drop all the tables) and running 
* Install the dependencies using `npm install`
* `npm run dev`
