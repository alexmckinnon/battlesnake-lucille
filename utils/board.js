/**
 * Construct grid with snakes and food positioned on board
 * @param {Object} data 
 * @returns {Array}
 */
function gameBoard(data) {

    // Construct empty board
    let board = [];
    for (let i = 0; i < data.height; i++) {
        board.push(new Array(data.width).fill('_'));
    }

    // Put food on board
    data.food.forEach((food) => {
        board[food.y][food.x] = 'o';
    });

    // Put snakes on board
    data.snakes.forEach((snake) => {
        snake.body.forEach((body) => {
            board[body.y][body.x] = 'x';
        });
        board[snake.body[0].y][snake.body[0].x] = 'H';
    });
    
    return board;

}

module.exports = { gameBoard }