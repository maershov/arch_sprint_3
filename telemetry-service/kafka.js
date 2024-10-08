const { Kafka } = require('kafkajs')
const service = require('./service/telemetry');
const broker = process.env.KAFKA || '127.0.0.1:9092';


const kafka = new Kafka({
    clientId: 'app',
    brokers: [broker]
});

const consumer = kafka.consumer({ groupId: 'group' });

async function run() {
    await consumer.connect();
    await consumer.subscribe({ topics: ['telemetry'], fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            switch (topic) {
                case 'telemetry':
                    const dto = JSON.parse(message.value.toString());
                    service.create(dto);
                    break;
                default:
                    console.warn(`topic ${topic} without handler`);
            }


        },
    })
}

run().catch(console.error)

module.exports = run;
