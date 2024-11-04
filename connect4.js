document.addEventListener("DOMContentLoaded", function() {
    let maininnerHtml = "";
    let clicks = 0;
    let validation;
    let gameOver = false;

    function resetValidation() {
        validation = [];
        for(let i = 0; i < 42; i++) {
            if(i % 7 === 0) {
                validation.push([i + 1]);
            } else {
                validation[validation.length - 1].push(i + 1);
            }
        }
        gameOver = false;
    }
    resetValidation();

    for(let i = 1; i <= 42; i++) {
        maininnerHtml += `
            <div class="square" data-column="${((i - 1) % 7) + 1}" data-row="${(Math.floor((i - 1) / 7) + 1)}" data-square="${i}" data-squarenumber="${i}"></div>
        `
    }
    document.getElementById("main").innerHTML += maininnerHtml;

    document.querySelectorAll("[data-square]").forEach(el => {
        el.addEventListener("click", function() {
            let player = clicks % 2 === 0 ? "yellow" : "red";
            let found = false;
    
            let droppedCell = addElements(player, el, found);

            winnerCheckerVertical(droppedCell, player);
            winnerCheckerHorizontal(player);
            checkDiagonal(droppedCell, player, 1, 1);  // Checks top-left to bottom-right
            checkDiagonal(droppedCell, player, -1, 1); // Checks bottom-left to top-right
            
            if (gameOver === false) {
                draw();
            }
        });
    });

    function addElements(player, el, found) {
        let column = el.dataset.column;
        let cellNumber = null;
        for (let i = 6; i >= 1; i--) {
            let cell = document.querySelector(`[data-column='${column}'][data-row='${i}']`);
            if (!cell.classList.contains("yellow") && !cell.classList.contains("red")) {
                cell.classList.add(player);
                cellNumber = cell;
                clicks++;
                found = true;
                break;
            }
        }
    
        for (let i = 0; i < validation.length; i++) {
            for (let j = 0; j < validation[i].length; j++) {
                if (cellNumber && cellNumber.dataset.square == validation[i][j]) {
                    validation[i][j] = clicks % 2 === 1 ? "yellow" : "red";
                    break;
                }
            }
        }
    
        if (found === false) {
            alert("Column is full");
        }
    
        return cellNumber;
    }

    function winnerCheckerVertical(droppedCell, player) {
        let column = droppedCell.dataset.column;
        let consecutiveCount = 0;
        let winner = false;
    
        for (let i = 1; i <= 6; i++) {
            let cell = document.querySelector(`[data-column='${column}'][data-row='${i}']`);
            
            if (cell.classList.contains(player)) {
                consecutiveCount++;
                if (consecutiveCount === 4) {
                    winner = true;
                    break;
                }
            } else {
                consecutiveCount = 0;
            }
        }
    
        if (winner) {
            gameWinner(player);
            gameOver = true;
        }
    }

    function winnerCheckerHorizontal(player) {
        let consecutiveCount = 0;
        let winner = false;
        let currentSquare = 1;

        for(let i = 0; i < validation.length; i++) {
            if((currentSquare + 1) % 7 === 0) consecutiveCount = 0;
            for(let j = 0; j < validation[i].length; j++) {
                currentSquare += 1;
                if(currentSquare === 43) break;
                let cell = document.querySelector(`[data-squarenumber='${currentSquare}']`);

                if(cell && cell.classList.contains(player)) {
                    consecutiveCount++;
                    if(consecutiveCount === 4) {
                        winner = true;
                        break;
                    }
                } else {
                    consecutiveCount = 0;
                }
            }
        }

        if (winner) {
            gameWinner(player);
            gameOver = true;
        }
    }

    function checkDiagonal(droppedCell, player, colStep, rowStep) {
        let startColumn = parseInt(droppedCell.dataset.column) - 3 * colStep;
        let startRow = parseInt(droppedCell.dataset.row) - 3 * rowStep;
        let consecutiveCount = 0;
    
        for (let i = 0; i < 8; i++) {
            let cell = document.querySelector(`[data-column='${startColumn + i * colStep}'][data-row='${startRow + i * rowStep}']`);
            
            if (cell && cell.classList.contains(player)) {
                consecutiveCount++;
                if (consecutiveCount === 4) {
                    gameWinner(player);
                    return;
                }
            } else {
                consecutiveCount = 0;
            }
        }
    }
    
    function gameWinner(player) {
        gameOver = true;
        setTimeout(() => {
            alert(`${player.charAt(0).toUpperCase() + player.slice(1)} is the winner!`);
            restartGame();
        }, 50);
    }

    function draw() {
        if (clicks === 42 && gameOver === false) {
            setTimeout(() => {
                alert("It's a draw!");
                restartGame();
            }, 50);
        }
    }

    function restartGame() {
        clicks = 0;
        resetValidation();
        document.querySelectorAll("[data-square]").forEach(el => {
            el.classList.remove("yellow", "red")
        });
    }
})
