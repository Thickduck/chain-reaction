


// grid generator
const generate = (width, height) => {
    const grid = document.getElementById("grid")
    grid.style.gridTemplateColumns =  `7fr repeat(${width}, 50px) 7fr`
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width + 2; j++) {
            const div = document.createElement('div')
            div.id = `row${i}-${j}`
            if(j === 0 || j === width + 1) {
                div.classList.add("empty")
            }
            else{
                div.classList.add("row")
                div.addEventListener('click', () => onClickRow(div, turn%2))
            }
            grid.appendChild(div)
        }
    }
}


// on click handler
const onClickRow = (div, team) => {
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
            matrix[i][j] = 0
        }
    }
    return matrix
}

const printMatrix = (matrix) => {
    for(let i = 0; i < matrix.length; i++) {
        console.log(matrix[i])
    }
}

let turn = 0
let matrix = matrixGen(6, 12)
printMatrix(matrix)
generate(6, 12)


