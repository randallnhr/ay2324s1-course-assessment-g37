#!/usr/bin/env node

import amqp from 'amqplib';
import { isMatchRequest } from './utility/isMatchRequest';
import { createMatcher } from './controllers/matcher';
import { MatchRequest } from './types';

const QUEUE_NAME = 'matching_service_queue';

const HOST = '127.0.0.1';
const PORT = '5672';

async function main() {
  const connection = await amqp.connect(`amqp://${HOST}:${PORT}`);
  const channel = await connection.createChannel();

  const matcher = createMatcher();

  const q = await channel.assertQueue(QUEUE_NAME, {
    durable: false,
  });
  channel.prefetch(1);
  console.log('Awaiting match requests...');

  channel.consume(
    q.queue,
    function reply(msg) {
      if (!msg) {
        console.log('No message found on consume, dropping packet');
        return;
      }
      const request = JSON.parse(msg.content.toString() ?? '');
      if (!isMatchRequest(request)) {
        console.log('Invalid match request, dropping packet');
        return;
      }

      const onMatch = (otherRequest: MatchRequest) => {
        console.log(`Replying to request ${JSON.stringify(request)} with match: ${JSON.stringify(otherRequest)}`)
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(otherRequest)),
          {
            correlationId: msg.properties.correlationId
          }
        );
      }
      console.log(`Queuing request ${JSON.stringify(request)}`);
      matcher.queueRequest(request, onMatch);
    },
    {
      noAck: true
    }
  )

}

main();
