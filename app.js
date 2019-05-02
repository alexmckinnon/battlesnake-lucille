'use strict'

const config = {
    snake: {
        name: 'Lucille',
        color: '#7d7d7c',
        headType: 'safe',
        tailType: 'round-bum'
    },
    output: {
        board: true
    },
    logger: {
        prettyPrint: {
            prettyPrint: true
        }
    }
}

const fastify = require('fastify')({
    logger: config.logger
})

const strategies = require('./logic/strategy');
const game = require('./utils/board');

fastify.get('/', function (request, response) {
    response.send('Battlesnake');
})

fastify.post('/start', (request, response) => {
    response.send(config.snake);
})

fastify.post('/move', (request, response) => {

    const board = game.gameBoard(request.body.board);
    const me = request.you;

    // Display board in console
    if (config.output.board) {
        console.log('board:');
        board.forEach((row) => {
            console.log(row.join(' | ') + ' |');
        });
    }

    // Get move
    const move = strategies.basic(board);

    response.send({
        "move": move
    });
})

fastify.post('/end', (request, response) => {
    response.send();
})

fastify.post('/ping', (request, response) => {
    response.send();
})

fastify.listen(3000, (error, port) => {
    if (error) {
        fastify.log.error(error);
        process.exit(1);
    }
})