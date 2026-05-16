let turn = 0

class Cell {
    constructor(i, j, owner, width, height) {
        this.i = i
        this.j = j
        this.owner = owner
        this.width = width
        this.height = height
        this.capacity = this.capacity()
    }
    capacity() {
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

// grid generator
const generate = (width, height) => {
    const grid = document.getElementById("grid")
    
    // The first 7fr and last 7fr automatically create the empty side margins
    grid.style.gridTemplateColumns = `7fr repeat(${width}, 50px) 7fr`
    
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            const div = document.createElement('div')
            div.id = `row${i}-${j}`
            div.classList.add("row")
            div.style.gridColumnStart = j + 2 
            
            div.addEventListener('click', () => onClickRow(div, i, j))
            grid.appendChild(div)
        }
    }
}

// on click handler
const onClickRow = (div, row, col) => {
    const team = turn % 2
    text = div.querySelector('p')
    if(!text) {
        text = document.createElement("p")
        div.appendChild(text)
        if(team === 0){
            text.style.color = "blue"
        }
        else {
            text.style.color = "red"
        }
    }
    if(text.innerText.length >= 3) {
        text.innerText = ""
    } else {
        text.innerText += "."
    }
    
    turn++
}

// matrix generator
const matrixGen = (width, height) => {
    let matrix = []
    for(let i = 0; i < height; i++) {
        matrix[i] = []
        for(let j = 0; j < width; j++) {
            matrix[i][j] = new Cell(i, j, null, width, height)
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

let matrix = matrixGen(6, 12)
printMatrix(matrix)
generate(6, 12)


