document.addEventListener('DOMContentLoaded', () => {
    
    // variables
    const span = document.getElementsByClassName('close')[0];
    const menu = document.querySelector('.menu');
    const toggler = document.querySelector('.toggler');
    const mainGrid = document.querySelector('.grid');
    const gridWidth = 10;
    const gridHeight = 20;
    const gridSize = gridWidth * gridHeight;
    const previousGrid = document.querySelector('.previous-grid');
    const startButton = document.querySelector('.button');
    let timerId;
    // the tetrominoes
    const lTetromino = [
        [1, gridWidth + 1, gridWidth * 2 + 1, 2],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2],
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2],
        [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2]
    ];

    const zTetromino = [
        [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
        [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
        [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
        [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1]
    ];

    const tTetromino = [
        [1, gridWidth, gridWidth + 1, gridWidth + 2],
        [1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
        [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, gridWidth, gridWidth + 1],
        [0, 1, gridWidth, gridWidth + 1],
        [0, 1, gridWidth, gridWidth + 1],
        [0, 1, gridWidth, gridWidth + 1]
    ];

    const iTetromino = [
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
    ];
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    let currentRotation = 0;
    // create grid
    const createGrid = () => {
        
        // the main grid
        for (let i = 0; i < gridSize; i++){
            let gridElement = document.createElement('div');
            mainGrid.appendChild(gridElement);
        }

        // base of grid
        for (let i = 0; i < gridWidth; i++){
            let gridElement = document.createElement('div');
            gridElement.setAttribute('class', 'block3');
            mainGrid.appendChild(gridElement);
        }

        // next grid
        for (let i = 0; i < 16; i++){
            let gridElement = document.createElement('div');
            previousGrid.appendChild(gridElement);
        }

        return mainGrid;
    };
//  create grid
    const grid = createGrid();
    //Randomly Select Tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    let squares = Array.from(grid.querySelectorAll('div'));
    //move the Tetromino moveDown
    let currentPosition = 4;
    const colors = [
        'url(images/blue_block.png)',
        'url(images/pink_block.png)',
        'url(images/purple_block.png)',
        'url(images/peach_block.png)',
        'url(images/yellow_block.png)'
    ];
    const width = 10;
    let nextRandom = 0;
    const displayWidth = 4;
    const displaySquares = document.querySelectorAll('.previous-grid div');
    let displayIndex = 0;
     const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
        [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
        [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
    ];
    let currentIndex = 0;
     let score = 0;
    let lines = 0;
    const scoreDisplay = document.querySelector('.score-display');
    const linesDisplay = document.querySelector('.lines-score');
    // draw the shape

    const draw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block');
            squares[currentPosition + index].style.backgroundImage = colors[random];
        });
    }

    // undraw the shape
    const undraw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block');
            squares[currentPosition + index].style.backgroundImage = 'none';
        });
    }
    // show previous tetromino in score display
    const displayShape = () => {
         displaySquares.forEach(square => {
            square.classList.remove('block');
            square.style.backgroundImage = 'none';
         });
        smallTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block');
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom];
        });
    }

    const addScore = () => {
        for (currentIndex = 0; currentIndex < gridSize; currentIndex += gridWidth) {
            const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9];
            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 10;
                lines += 1;
                scoreDisplay.innerHTML = score;
                linesDisplay.innerHTML = lines;
                row.forEach(index => {
                    squares[index].style.backgroundImage = 'none';
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block');

                })
                //splice array
                const squaresRemoved = squares.splice(currentIndex, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    const gameOver = () => {
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }

    // freeze the shape
    const freeze = () => {
        // if block has settled
        if (current.some(index=>squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
            // make it block2
            current.forEach(index => squares[index + currentPosition].classList.add('block2'));
            // start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move down on loop
    const moveDown = () => {
        undraw();
        currentPosition = currentPosition += width;
        draw();
        freeze();
    }
    const moveright = () => {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1;
        }
        draw();
    };

    const rotate = () => {
        undraw();
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    };
const moveleft = () => {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1;
        }
        draw();
    };
//assign functions to keycodes
    const control = (e) => {
        if (e.keyCode === 39)
            moveright();
        else if (e.keyCode === 38)
            rotate();
        else if (e.keyCode === 37)
            moveleft();
        else if (e.keyCode === 40)
            moveDown();
    }

    // self Invoked Functions
    freeze();
    
// event listner Functions
    
    // close rules
    span.addEventListener('click', () => {
        menu.style.display = 'none';
    });

    // open rules
    toggler.addEventListener('click', () => {
        menu.style.display = 'flex';
    });

    // start or pause the Game
    startButton.addEventListener('click', () => {
        if (timerId) {
            // stop the game
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });
    // the classical behavior is to speed up the block if down button is kept pressed so doing that
    document.addEventListener('keydown', control);
});