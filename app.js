let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let gameModeSelect = document.querySelector("#game-mode");

let turnO = true; // Player O starts
let count = 0; // To track draw

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos1Val === pos2Val && pos1Val === pos3Val) {
            showWinner(pos1Val);
            return true;
        }
    }
    return false; // No winner found
};

const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
};

// Function for computer's move
const computerMove = () => {
    let availableMoves = [];
    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            availableMoves.push(index);
        }
    });

    // Basic AI logic to block opponent or win
    for (let pattern of winPatterns) {
        for (let i = 0; i < 3; i++) {
            const [a, b, c] = pattern;
            if (boxes[a].innerText === "X" && boxes[b].innerText === "X" && boxes[c].innerText === "") {
                boxes[c].innerText = "X"; // Block
                boxes[c].style.color = "black"; 
                return;
            } else if (boxes[a].innerText === "O" && boxes[b].innerText === "O" && boxes[c].innerText === "") {
                boxes[c].innerText = "X"; // Win
                boxes[c].style.color = "black"; 
                return;
            }
        }
    }

    if (availableMoves.length > 0) {
        const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        boxes[move].innerText = "X"; // Assume computer is X
        boxes[move].style.color = "black"; // Color for computer
        count++;

        if (checkWinner()) {
            return; // Stop if there's a winner
        }

        if (count === 9) {
            gameDraw(); // Check for draw
        }

        turnO = true; // Switch turns back to player O
    }
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText === "") { // Only allow clicking in empty boxes
            box.innerText = turnO ? "O" : "X"; // Player O
            box.style.color = turnO ? "red" : "black"; // Color for player
            count++;

            if (checkWinner()) {
                return; // Stop if there's a winner
            }

            if (count === 9) {
                gameDraw(); // Check for draw
            }

            turnO = false; // Switch turns to computer
            if (gameModeSelect.value === "computer") {
                setTimeout(computerMove, 500); // Add a slight delay for better UX
            }
        }
    });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
