'use strict'

const path = require('path')
const strategies = require('./logic/strategy');
const game = require('./utils/board');

const config = {
    snake: {
        name: 'Lucille',
        color: '#8B8BA0',
        headType: 'safe',
        tailType: 'round-bum'
    },
    output: {
        board: false,
        moves: false
    },
    logger: {
        prettyPrint: {
            prettyPrint: true
        }
    },
    port: process.env.PORT || 5000
}

const fastify = require('fastify')({
    logger: false
})

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})


fastify.get('/', function (request, response) {
    response.sendFile('index.html')
})

fastify.post('/start', (request, response) => {
    response.send(config.snake);
})

fastify.post('/move', (request, response) => {

    const me = request.body.you;
    const board = game.gameBoard(request.body.board, me);
    const snakes = game.otherSnakes(request.body.board.snakes);    

    // Display board in console
    if (config.output.board) {
        console.log('board (turn ' + request.body.turn + '):');
        board.forEach((row) => {
            console.log(row.join(' | ') + ' |');
        });
    }

    // Get move
    const move = strategies.basic(board, me, snakes, config);

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

fastify.setNotFoundHandler((request, response) => response.redirect('/'));

fastify.listen(config.port, '0.0.0.0', (error, port) => {
    if (error) {
        fastify.log.error(error);
        process.exit(1);
    }
})