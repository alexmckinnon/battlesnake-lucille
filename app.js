'use strict'

const fastify = require('fastify')({
    logger: {
        prettyPrint: false 
    }
})

fastify.get('/', function (request, reply) {
    reply.send('Battlesnake')
})

fastify.post('/start', (request, response) => {
    response.send({
        "color": "#736CCB",
        "headType": "beluga",
        "tailType": "curled"
    })
})

fastify.post('/move', (request, response) => {
    response.send({
        "move": "down"
    })
})

fastify.post('/end', (request, response) => {
    response.send()
})

fastify.post('/ping', (request, response) => {
    response.send()
})

fastify.listen(3000, (error, port) => {
    if (error) {
        fastify.log.error(error)
        process.exit(1) 
    }
})