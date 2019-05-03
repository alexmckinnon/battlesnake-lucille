/**
 * Basic move algorithm - do some things and return a direction
 * @param {Object} board
 * @param {Object} me
 * @returns String 
 */
function basic(board, me) {

    const head = me.body[0];

    // Get available moves
    const moves = availableMoves(me.body[0], board);

    // Forced to commit suicide
    if (!moves.length) {
        return 'down';
    }

    // If only one, go there
    if (moves.length === 1) {
        return moves[0].direction;
    }

    // Todo:
    // Check if any moves are potential head-ons and adjust weight
    // Seek food
    // Seek heads of lesser snakes
    //headOnCollisonCheck(moves, board);

    // Check if moves lead to dead ends and adjust weights
    checkForDeadEnds(moves, board);

    // Filter highest weighted moves
    const weight = Math.max(...moves.map(move => move.weight), 0);
    const weightedMoves = moves.filter((move) => {
        return move.weight == weight;
    });

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

    const options = [
        {  direction: 'up',    x: head.x,      y: head.y - 1,  weight: 0  },
        {  direction: 'down',  x: head.x,      y: head.y + 1,  weight: 0  },
        {  direction: 'left',  x: head.x - 1,  y: head.y,      weight: 0  },
        {  direction: 'right', x: head.x + 1,  y: head.y,      weight: 0  },
    ]
    
    options.forEach((option) => {
        if (outOfBounds(option.x, option.y, board.length - 1)) {
            return;
        }
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
        let nextMoves = [];
        const nextOptions = [
            {  x: move.x,      y: move.y - 1  },
            {  x: move.x,      y: move.y + 1  },
            {  x: move.x - 1,  y: move.y      },
            {  x: move.x + 1,  y: move.y      },
        ];

        nextOptions.forEach((option) => {
            if (!outOfBounds(option.x, option.y, board.length - 1)
                && ( openSpace(option.x, option.y, board) || isFood(option.x, option.y, board) )) {
                nextMoves.push(option);
            }
        })

        if (nextMoves.length == 0) {
            moves[index].weight = 0;
        }
    });
}

module.exports = { basic } 