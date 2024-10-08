const { Kafka } = require('kafkajs')
const broker = process.env.KAFKA || '127.0.0.1:9092';


const kafka = new Kafka({
    clientId: 'app',
    brokers: [broker]
});

const producer = kafka.producer();

async function run() {
    await producer.connect();
}

async function produceDeviceChangeStatus(deviceId, status) {
    const message = JSON.stringify({
        device_id: deviceId,
        status
    });
    console.log(message)
    await producer.send({
        topic: 'device.status',
        messages: [
            {
                value: message
            },
        ],
    });
}

async function produceDeviceCommand(deviceId, command) {
    const message = JSON.stringify({
        device_id: deviceId,
        command
    });
    console.log(message);
    await producer.send({
        topic: 'device.command',
        messages: [
            {
                value: message
            },
        ],
    });
}

run().catch(console.error)

module.exports = {
    run,
    produceDeviceCommand,
    produceDeviceChangeStatus
};
