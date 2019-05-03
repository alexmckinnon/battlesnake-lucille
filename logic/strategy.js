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

    // If only one, go there
    if (moves.length === 1) {
        return moves[0].direction;
    }

    return moves[Math.floor(Math.random()*moves.length)].direction;
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
        {  direction: 'up',    x: head.x,      y: head.y - 1  },
        {  direction: 'down',  x: head.x,      y: head.y + 1  },
        {  direction: 'left',  x: head.x - 1,  y: head.y      },
        {  direction: 'right', x: head.x + 1,  y: head.y      },
    ]
    
    options.forEach((option) => {
        if (openSpace(option.x, option.y, board)) {
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

    if (outOfBounds(x, y, board.length - l)) {
        return false;
    }

    const openSpaces = ['_', 'o'];

    return openSpaces.includes(board[y][x]);
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

module.exports = { basic } 