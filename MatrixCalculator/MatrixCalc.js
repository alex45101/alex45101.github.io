const minTableSize = 2;

class matrix {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }
}

var mainMatrix = new matrix(3, 3);

document.body.onload = () => {
    setUpTable();
}

function setUpTable() {
    let matrixDiv = document.getElementById("mainMatrixTable");
    let matrixTable = document.createElement("table");
    matrixTable.id = "matrixTable";

    for (var i = 0; i < mainMatrix.length; i++) {
        let row = document.createElement("tr");

        for (var j = 0; j < mainMatrix.width; j++) {
            let textBox = document.createElement("input");
            let cell = document.createElement("td");

            textBox.input = "text";

            cell.appendChild(textBox);
            row.appendChild(cell);
        }
        matrixTable.appendChild(row);
    }

    matrixDiv.appendChild(matrixTable);
}

function clearTable() {
    let matrix = document.getElementById("mainMatrixTable");
    matrix.removeChild(document.getElementById("matrixTable"));
}

function matrixResize(button) {
    clearTable();

    if (button.value == "-") {
        if (mainMatrix.length > minTableSize && mainMatrix.width > minTableSize) {
            mainMatrix.length--;
            mainMatrix.width--;
        }
    }
    else if (button.value == "+") {
        mainMatrix.length++;
        mainMatrix.width++;
    }

    setUpTable();
}