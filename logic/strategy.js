/**
 * Basic move algorithm - do some things and return a direction
 * @param {Object} board
 * @param {Object} me
 * @param {Object} snakes
 * @param {Object} config
 * @returns String 
 */
function basic(board, me, snakes, config) {

    const head = me.body[0];

    // Get available moves
    // Todo: snake tails are open spaces next turn
    const moves = availableMoves(me.body[0], board);

    // Forced to commit suicide
    if (!moves.length) {
        return 'down';
    }

    // If only one, go there
    if (moves.length === 1) {
        return moves[0].direction;
    }
    
    // Check if any moves are potential head-ons and adjust weight
    checkForHeadOnCollisons(moves, board, me, snakes);

    // Todo:
    // Seek food
    // Seek heads of lesser snakes
    // Avoid tight spaces (don't corner yourself) << IMPORTANT

    // Check if moves lead to dead ends and adjust weights
    // Todo: dead end check doesn't account for if you could kill a snake by going this way and opening up a path
    checkForDeadEnds(moves, board);

    //if health is under X increase weight of directions that lead to food

    // Filter highest weighted moves
    // Todo: use hunter/prey checks and favour hunter
    const weight = Math.max(...moves.map(move => move.weight), 0);
    const weightedMoves = moves.filter((move) => {
        return move.weight == weight;
    });

    if (config.output.moves) {
        console.log(moves);
    }
    
    // Choose random direction from weighted 
    const random = Math.floor(Math.random() * weightedMoves.length);
    return weightedMoves[random].direction;
}

/**
 * Get array of allowed moves
 * @param {Object} head 
 * @param {Object} board
 * @returns {String} 
 */
function availableMoves(head, board) {

    let moves = [];

    const options = getValidSurroundingCoordinates(head.x, head.y, board);
    
    options.forEach((option) => {
        if (openSpace(option.x, option.y, board)) {
            option.weight += 1;
            moves.push(option);
        }
        if (isFood(option.x, option.y, board)) {
            option.weight += 3;
            moves.push(option);
        }
    });

    return moves;
}

/**
 * Check if x/y coordinates are an open spot on the board
 * @param {Number} x 
 * @param {Number} y 
 * @param {Object} board 
 * @returns {Boolean}
 */
function openSpace(x, y, board) {
    return board[y][x] == '_';
}

/**
 * Check if x/y coordinates are food
 * @param {Number} x
 * @param {Number} y
 * @param {Object} board
 * @returns {Boolean}
 */
function isFood(x, y, board) {
    return board[y][x] == 'o';
}

/**
 * Check if x/y coordinates are a snake head
 * @param {Number} x
 * @param {Number} y
 * @param {Object} board
 * @returns {Boolean}
 */
function isSnakeHead(x, y, board) {
    return board[y][x] == 'H';
}

/**
 * Check of x or y is outside grid
 * @param {Number} x
 * @param {Number} y
 * @param {Number} max
 * @returns {Boolean}
 */
function outOfBounds(x, y, max) {
    return (x < 0 || y < 0 || x > max || y > max);
}

/**
 * Check each potential next move to see if it leads to a dead end
 * If it does set it's weight to 0
 * @param {Object} moves
 * @param {Object} board
 */
function checkForDeadEnds(moves, board) {
    moves.forEach((move, index) => {
        let nextMoves = getValidNextMoves(move.x, move.y, board);
        if (nextMoves.length == 0) {
            moves[index].weight = 0;
        }
    });
}

/**
 * Get array of open moves around given coordinates
 * @param {Number} x 
 * @param {Number} y 
 * @param {Object} board 
 * @returns {Array}
 */
function getValidNextMoves(x, y, board) {

    let nextMoves = [];
    const nextOptions = getValidSurroundingCoordinates(x, y, board);

    nextOptions.forEach((option) => {
        if (openSpace(option.x, option.y, board) || isFood(option.x, option.y, board)) {
            nextMoves.push(option);
        }
    });

    return nextMoves;
}

/**
 * Set the hunter/prey move properties if move has head on collision potential
 * @param {Object} moves 
 * @param {Object} board 
 * @param {Object} me 
 * @param {Object} snakes 
 */
function checkForHeadOnCollisons(moves, board, me, snakes) {
    const myLength = me.body.length;
    moves.forEach((move, index) => {
        let surroudingCoordinates = getValidSurroundingCoordinates(move.x, move.y, board);
        let hunter = false;
        let prey = false;
        let snakeHead = false;
        surroudingCoordinates.forEach((surrounding) => {
            snakeHead = isSnakeHead(surrounding.x, surrounding.y, board);
            if (snakeHead) {
                let otherSnakeLength = getSnakeLength(surrounding.x, surrounding.y, snakes);
                if (otherSnakeLength >= myLength) {
                    prey = true;
                }
                if (otherSnakeLength < myLength) {
                    hunter = true;
                }
            }
        });
        if (snakeHead) {
            if (prey) {
                moves[index].prey = true;
                moves[index].weight = 0;
            } else if (hunter) {
                moves[index].hunter = true;
            }
        }
    });
}

/**
 * Get length of snake who's head is at x/y
 * @param {Number} x 
 * @param {Number} y 
 * @param {Object} snakes 
 */
function getSnakeLength(x, y, snakes) {
    return snakes.find((snake) => snake.head = x + '.' + y).body.length;
}

/**
 * Get array of surrounding coordinates that are not out of bounds
 * @param {Number} x 
 * @param {Number} y 
 * @param {Object} board 
 * @returns {Array}
 */
function getValidSurroundingCoordinates(x, y, board) {

    let inBounds = [];
    const coordinates = [
        {  direction: 'up',    x,         y: y - 1,  weight: 0,  hunter: false,  prey: false  },
        {  direction: 'down',  x,         y: y + 1,  weight: 0,  hunter: false,  prey: false  },
        {  direction: 'left',  x: x - 1,  y,         weight: 0,  hunter: false,  prey: false  },
        {  direction: 'right', x: x + 1,  y,         weight: 0,  hunter: false,  prey: false  }
    ];

    coordinates.forEach((option) => {
        if (!outOfBounds(option.x, option.y, board.length - 1)) {
            inBounds.push(option);
        }
    });

    return inBounds;
}

module.exports = { basic } 