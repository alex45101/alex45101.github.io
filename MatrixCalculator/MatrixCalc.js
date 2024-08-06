const minTableSize = 2;

var matrixCounter = 0;

class matrix {
    constructor(length, width) {
        this.length = length;
        this.width = width;
        this.id = matrixCounter;
        this.initialSetup = true;

        matrixCounter++;
    }

    setUpTable() {
        let currDiv;
        if (this.initialSetup) {
            //generate a div and label it corresponding to the matrix id
            currDiv = document.createElement("div");
            currDiv.id = "matrixDiv-" + this.id.toString();
        }
        else {
            //grab the current div for the matrix
            currDiv = document.getElementById("matrixDiv-" + this.id.toString());
        }

        //generate a form and label it corresponding to the matrix id
        let form = document.createElement("form");
        form.id = "matrixForm-" + this.id.toString();

        //generate a table and label it corresponding to the matrix id
        let table = document.createElement("table");
        table.id = "matrixTable-" + this.id.toString();

        //generate the cells for each position in the matrix
        for (var i = 0; i < this.length; i++) {
            let row = document.createElement("tr");

            for (var j = 0; j < this.width; j++) {
                let textBox = document.createElement("input");
                let cell = document.createElement("td");

                textBox.input = "text";

                cell.appendChild(textBox);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        form.appendChild(table);

        //Generate Increase and Decrease Buttons
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

        form.appendChild(decreaseButton);
        form.appendChild(increaseButton);

        currDiv.appendChild(form);

        if (this.initialSetup) {
            //get the div element for all the matrices and add the new matrix to it
            let matricesDiv = document.getElementById("matrices");
            matricesDiv.appendChild(currDiv);
        }

        this.initialSetup = false;
    }

    matrixResize(button) {
        this.clearTable();

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
        document.getElementById("matrixDiv-" + this.id.toString()).removeChild(document.getElementById("matrixForm-" + this.id.toString()));
    }
}

var mainMatrix = new matrix(3, 3);

document.body.onload = () => {
    mainMatrix.setUpTable();
}