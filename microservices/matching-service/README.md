## Matching Service

This directory sets up a server to match users based on their sleected question complexity.

### Set Up
Clone the repository, install dependencies and set up environment.
```
cd ./microservices/matching-service
npm install
```

Run the rabbitMQ container to listen to client and server messages via Advanced Message Queue Protocol (AMQP) on local host port 5672.
```
npm run rabbitMQ
```

Start the server.
```
npm run serve
```

Request for a match by opening 2 new terminals to simulate 2 clients.
On the first client, run the matching service with userId `123` and question complexity `Easy`
```
npm run match -- 123 Easy
```

On the second client, run the matching service with userId `456` and question complexity `Easy`
```
npm run match -- 456 Easy
```

### API Reference

#### Types

```
type MatchRequest = {
  userId: string
  complexity: 'Easy' | 'Medium' | 'Hard'
}
```

#### Request Match

Request: send AMQP message to the server's queue
```
queue: 'matching_service_queue', # Server's queue name
buffer: Buffer.from(JSON.stringify(request)), # Send a request of type MatchRequest
options: {
  correlationId: correlationId, # Unique transaction id (string) 
  replyTo: clientQueueName # Client's queue name (string)
}
```
