let turn = 0
let matrix = []
let timerInterval;
let timeLeft = 15;
const MAX_TIME = 15;
let gameOver = false;

class Cell {
    constructor(i, j, owner, strength, width, height) {
        this.i = i
        this.j = j
        this.owner = owner
        this.strength = strength
        this.width = width
        this.height = height
        this.capacity = this.calcCapacity()
    }
    calcCapacity() {
        let capacity
        if ((this.i === 0 && this.j === 0) || (this.i === this.height - 1 && this.j === 0) || (this.i === 0 && this.j === this.width - 1) || (this.i === this.height - 1 && this.j === this.width - 1)) {
            capacity = 2
        }
        else if (this.i === 0 || this.i === this.height - 1 || this.j === 0 || this.j === this.width - 1) {
            capacity = 3
        }
        else {
            capacity = 4
        }
        return capacity
    }
}

const matrixGen = (width, height) => {
    let matrix = []
    for(let i = 0; i < height; i++) {
        matrix[i] = []
        for(let j = 0; j < width; j++) {
            matrix[i][j] = new Cell(i, j, 0, 0, width, height)
        }
    }
    return matrix
}

const printMatrix = (matrix) => {
    for(let i = 0; i < matrix.length; i++) {
        let sub = matrix[i]
        let rowstring = ""
        for(let j = 0; j < sub.length; j++) {
            rowstring += " " + sub[j].capacity
        }
        console.log(rowstring)
    }
}

const generate = (width, height) => {
    matrix = matrixGen(width, height)
    const grid = document.getElementById("grid")
    grid.style.gridTemplateColumns = `7fr repeat(${width}, 50px) 7fr`
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            const div = document.createElement('div')
            div.id = `row${i}-${j}`
            div.classList.add("row")
            div.style.gridColumnStart = j + 2 
            
            div.addEventListener('click', () => onClick(div, i, j))
            grid.appendChild(div)
        }
    }
}

const burst = (i, j, w, h) => {
    const neighbours = []
    switch(i) {
        case 0: 
            neighbours.push(matrix[i+1][j])
            break
        case h-1: 
            neighbours.push(matrix[i-1][j])
            break
        default:
            neighbours.push(matrix[i-1][j])
            neighbours.push(matrix[i+1][j])
    }
    switch(j) {
        case 0:
            neighbours.push(matrix[i][j+1])
            break
        case w-1:
            neighbours.push(matrix[i][j-1])
            break
        default:
            neighbours.push(matrix[i][j-1])
            neighbours.push(matrix[i][j+1])
    }
    return neighbours
}

const updateCell = (team, cell, text) => {
    const style = team === 0 ? "blue" : "red"
    text.style.color = style
    cell.strength += 1
    text.innerText = cell.strength
    cell.owner = style
}

const processCell = (cell, team, text, matrix) => {
    updateCell(team, cell, text)

    if (cell.strength >= cell.capacity) {
        const neighbours = burst(cell.i, cell.j, matrix[0].length, matrix.length)
        cell.strength = 0;
        text.innerText = ""
        for(let i = 0; i < neighbours.length; i++) {
            const nCell = neighbours[i]
            const nDiv = document.getElementById(`row${nCell.i}-${nCell.j}`)
            let nText = nDiv.querySelector('p')
            if(!nText) {
                nText = document.createElement('p')
                nDiv.appendChild(nText)
            }

            processCell(nCell, team, nText, matrix)
        }
    }
}

const initUI = () => {
    const header = document.createElement("div");
    header.id = "game-header";
    header.style.display = "flex";
    header.style.justifyContent = "center";
    header.style.gap = "50px";
    header.style.marginBottom = "20px";
    header.style.fontFamily = "sans-serif";
    header.style.fontSize = "18px";

    header.innerHTML = `
        <div id="score-blue" style="color: blue; font-weight: bold;">Blue: 0</div>
        <div id="timer" style="font-weight: bold;">Time: ${MAX_TIME}s</div>
        <div id="score-red" style="color: red; font-weight: bold;">Red: 0</div>
    `;
    
    document.body.insertBefore(header, document.getElementById("grid"));
}

const calculateScores = () => {
    let blueScore = 0;
    let redScore = 0;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].owner === "blue") blueScore += matrix[i][j].strength;
            if (matrix[i][j].owner === "red") redScore += matrix[i][j].strength;
        }
    }

    document.getElementById("score-blue").innerText = `Blue: ${blueScore}`;
    document.getElementById("score-red").innerText = `Red: ${redScore}`;

    if (turn >= 2 && !gameOver) {
        if (blueScore === 0) triggerGameOver("Red");
        if (redScore === 0) triggerGameOver("Blue");
    }
}

const startTimer = () => {
    clearInterval(timerInterval);
    timeLeft = MAX_TIME;
    document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            turn++;
            updateTurnDisplay();
            startTimer();
        }
    }, 1000);
}

const updateTurnDisplay = () => {
    let turn_div = document.getElementById("turn");
    if(turn_div && turn_div.querySelector('p')) {
        turn_div.style.textAlign = "center";
        turn % 2 === 0 ? turn_div.querySelector('p').innerText = "Turn: Red" : turn_div.querySelector('p').innerText = "Turn: Blue";
    }
}

const triggerGameOver = (winner) => {
    gameOver = true;
    clearInterval(timerInterval);

    const replayMenu = document.createElement("div");
    replayMenu.id = "replay-menu";
    replayMenu.style.textAlign = "center";
    replayMenu.style.marginTop = "20px";
    replayMenu.innerHTML = `
        <h2 style="color: ${winner.toLowerCase()};">${winner} Wins!</h2>
        <button id="replay-btn" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Play Again</button>
    `;
    
    document.body.appendChild(replayMenu);

    document.getElementById("replay-btn").addEventListener("click", () => {
        turn = 0;
        gameOver = false;
        document.getElementById("replay-menu").remove();
        document.getElementById("grid").innerHTML = ""; 
        
        generate(matrix[0].length, matrix.length);
        calculateScores();
        updateTurnDisplay();
        startTimer();
    });
}

const onClick = (div, row, col) => {
    if (gameOver) return; 
    
    const indexString = div.id.slice(3).split("-")
    const i = +indexString[0]
    const j = +indexString[1]

    const team = turn % 2; 

    const cell = matrix[i][j]
    if(turn >= 2 && !div.hasChildNodes()) return;
    let text = div.querySelector("p");
    if (!text) {
        text = document.createElement("p");
        div.appendChild(text);
    }
    const currentColor = window.getComputedStyle(text).color;
    if (team === 0 && currentColor === "rgb(255, 0, 0)") return;
    if (team === 1 && currentColor === "rgb(0, 0, 255)") return;

    processCell(cell, team, text, matrix)

    let turn_div = document.getElementById("turn")
    if(turn_div) {
        turn_div.style.textAlign = "center";
        turn % 2 === 0 ? turn_div.querySelector('p').innerText = "Turn: Red" : turn_div.querySelector('p').innerText = "Turn: Blue"
    }
    turn++;

    calculateScores();
    startTimer();
}

const createStartMenu = () => {
    const turnDiv = document.getElementById("turn");
    if (turnDiv) {
        turnDiv.style.display = "none";
        turnDiv.style.textAlign = "center";
    }

    const startDiv = document.createElement("div");
    startDiv.id = "start-menu";
    startDiv.style.textAlign = "center";
    startDiv.style.marginTop = "50px";
    
    const startBtn = document.createElement("button");
    startBtn.innerText = "Start Game";
    startBtn.style.padding = "10px 20px";
    startBtn.style.fontSize = "20px";
    startBtn.style.cursor = "pointer";
    
    startBtn.addEventListener("click", () => {
        startDiv.remove();
        if (turnDiv) {
            turnDiv.style.display = "block";
        }
        initUI();
        generate(10, 10);
        startTimer();
    });
    
    startDiv.appendChild(startBtn);
    document.body.insertBefore(startDiv, document.getElementById("grid"));
}

createStartMenu();