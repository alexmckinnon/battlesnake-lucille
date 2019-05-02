/**
 * Basic move algorithm - do some things and return a direction
 * @param {Object} board
 * @param {Object} me
 * @returns String 
 */
function basic(board, me) {

    const head = me.body[0];
    const moves = availableMoves(me.body[0], board);

    return moves[Math.floor(Math.random()*moves.length)]
}

/**
 * Get array of allowed moves
 * @param {Object} head 
 * @param {Object} board
 * @returns {String} 
 */
function availableMoves(head, board) {

    let moves = ['up','right','down','left'];
    const openSpaces = ['_', 'o'];

    // check if up is open
    if (head.y === 0 || !openSpaces.includes(board[head.y - 1][head.x])) {
        let index = moves.indexOf('up');
        moves.splice(index, 1);
    }

    // check if down is open
    if (head.y === board.length - 1 || !openSpaces.includes(board[head.y + 1][head.x])) {
        let index = moves.indexOf('down');
        moves.splice(index, 1);
    }

    // check if left is open
    if (head.x === 0 || !openSpaces.includes(board[head.y][head.x - 1])) {
        let index = moves.indexOf('left');
        moves.splice(index, 1);
    }

    // check if right is open
    if (head.x === board.length - 1 || !openSpaces.includes(board[head.y][head.x + 1])) {
        let index = moves.indexOf('right');
        moves.splice(index, 1);
    }

    return moves;
}

module.exports = { basic } 