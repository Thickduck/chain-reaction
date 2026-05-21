let turn = 0
let matrix = []

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

// matrix generator
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


// grid generator
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

// on click handler
const onClick = (div, row, col) => {
    // get the indecies of the clicked box
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
    turn % 2 === 0 ? turn_div.querySelector('p').innerText = "Turn: Red" : turn_div.querySelector('p').innerText = "Turn: Blue"
    turn++;
}


generate(10, 10)

