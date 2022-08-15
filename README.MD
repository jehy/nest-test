# Sample banking microservice

## Start
docker-compose up

## Testing
```bash
docker-compose up
npm run migrate:up
npm run fixtures
npm run test:e2e
```
## Api doc
http://127.0.0.1:3000/graphql

## Some explanations
1. Amount calculation is done in postgres because JS suffers from floating point operations.
2. Currency courses change so I added a table for courses with historical data.
3. I wanted to add a transaction history table which could provide really important information. Also, it could be linked with courses table to show which course we used at the moment.
4. There is no pm2, nodemon or other supervisers because nobody really use them in production. But of course we have to launch, monitor and balance our microservice.
5. I don't like end to end tests because they are heavy and difficult to write. But it made no sense to write unit tests here.

## What else could be done
1. Full testing within docker, for now it can be only done locally.
2. Better linting and tsconfig settings.
3. CI could be made with github actions. It's really simple but I'm too short on time.
4. I'm pretty sure that I messed up several times around postgres data types and courses conversion - but I suppose that you get the general idea :)
