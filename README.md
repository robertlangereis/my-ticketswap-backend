# TicketSwap rebuild - Robert Langereis

*NOTE THIS PROJECT IS STILL IN DEVELOPMENT*

This is the backend (REST API) for a Ticketswap lookalike (main functionality), by Robert Langereis, as a final (individual) assignment for the Codaisseur Academy. We had 5 days to finish this final assignment. For this REST API I used the following dev tech:
- Postgres, TypeORM & Koa (instead of express)

# Checkout the deployed (client) side of this webapp: https://condescending-perlman-1c4647.netlify.com
--> This is the corresponding frontend webapp for this backend API. The GIT repository for this  project can be found here: https://github.com/robertlangereis/my-ticketswap-frontend 

* This REST API is deployed using heroku, on heroku: https://dashboard.heroku.com/apps/ticketswap-api-langereis 

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
