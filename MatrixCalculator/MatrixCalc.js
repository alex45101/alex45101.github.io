const minTableSize = 2;

var matrixCounter = 0;

class matrix {
    constructor(length, width) {
        this.length = length;
        this.width = width;
        this.id = matrixCounter;
        this.initialSetup = true;

        this.vertices = [];

        matrixCounter++;
    }

    setUpTable() {
        let currDiv = this.getCurrDiv();

        //generate a form and label it corresponding to the matrix id
        let form = document.createElement("form");
        form.id = "matrixForm-" + this.id.toString();

        //generate a table and label it corresponding to the matrix id
        let table = document.createElement("table");
        table.id = "matrixTable-" + this.id.toString();

        //generate the cells for each position in the matrix
        let newId = 0;
        for (var i = 0; i < this.length; i++) {
            let row = document.createElement("tr");

            for (var j = 0; j < this.width; j++, newId++) {
                let cell = document.createElement("td");
                
                //CLEAN THIS UP
                let textBox = document.createElement("input");
                textBox.id = (newId).toString();
                textBox.input = "text";
                if (this.vertices[textBox.id] != undefined)
                    textBox.value = this.vertices[textBox.id];
                textBox.onchange = (event) => { this.vertices[textBox.id] = textBox.value; };

                cell.appendChild(textBox);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        form.appendChild(table);

        //Generate Increase and Decrease Buttons
        var buttons = this.generateResizeButtons();

        for (var i = 0; i < buttons.length; i++) {
            form.appendChild(buttons[i]);
        }

        currDiv.appendChild(form);

        if (this.initialSetup) {
            //get the div element for all the matrices and add the new matrix to it
            let matricesDiv = document.getElementById("matrices");
            matricesDiv.appendChild(currDiv);
        }

        this.initialSetup = false;
    }

    getCurrDiv() {
        let currDiv;

        //if initial setup generate div for matrix else grab it
        if (this.initialSetup) {
            currDiv = document.createElement("div");
            currDiv.id = "matrixDiv-" + this.id.toString();
        }
        else {
            currDiv = document.getElementById("matrixDiv-" + this.id.toString());
        }

        return currDiv;
    }

    generateResizeButtons() {
        //generate the 2 buttons needed to resize a matrix
        let increaseButton = document.createElement("input");
        increaseButton.id = "increaseButton-" + this.id.toString();
        increaseButton.type = "button";
        increaseButton.value = "+";
        increaseButton.onclick = () => this.matrixResize(increaseButton);

        let decreaseButton = document.createElement("input");
        decreaseButton.id = "decreaseButton-" + this.id.toString();
        decreaseButton.type = "button";
        decreaseButton.value = "-";
        decreaseButton.onclick = () => this.matrixResize(decreaseButton);

        return [decreaseButton, increaseButton];
    }

    matrixResize(button) {
        //clear the table then regenerate it at the end
        this.clearTable();

        //if decreasing make sure that either lenght or width go below minTableSize
        if (button.value == "-") {
            if (this.length > minTableSize && this.width > minTableSize) {
                this.length--;
                this.width--;
            }
        }
        else if (button.value == "+") {
            this.length++;
            this.width++;
        }

        this.setUpTable();
    }

    clearTable() {
        //remove the current form from the matrix div
        this.getCurrDiv().removeChild(document.getElementById("matrixForm-" + this.id.toString()));
    }
}

var mainMatrix = new matrix(3, 3);

var matrices = [new matrix(2, 2), new matrix(5, 2), new matrix(4, 4)];

document.body.onload = () => {
    mainMatrix.setUpTable();

    for (var i = 0; i < 3; i++) {
        matrices[i].setUpTable();
    }
}