const minTableSize = 2;

var matrixCounter = 0;

class matrix {
    constructor(length, width) {
        this.length = length;
        this.width = width;
        this.id = matrixCounter;
        this.initialSetup = true;

        this.vertices = Array.from({ length: this.length }, () => new Array(width).fill(undefined));

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
        for (var i = 0; i < this.length; i++) {
            let row = document.createElement("tr");

            for (var j = 0; j < this.width; j++) {
                let cell = document.createElement("td");

                //CLEAN THIS UP
                let textBox = document.createElement("input");
                textBox.id = i.toString() + j.toString();
                //textBox.value = textBox.id;
                textBox.input = "text";

                //TODO::::get the index from the id

                this.vertices[i][j] = textBox.value;
                //if (this.vertices[i][j] != undefined)
                    //textBox.value = this.vertices[textBox.id];

                textBox.onchange = (event) => { this.vertices[i][j] = textBox.value; };

                cell.appendChild(textBox);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        form.appendChild(table);

        //Generate Increase and Decrease Buttons
        var resizeButtons = this.generateResizeButtons();

        for (var i = 0; i < resizeButtons.length; i++) {
            form.appendChild(resizeButtons[i]);
        }


        //Generate Function Buttons
        var funcButtons = this.generateFunctionButtons();

        for(var i = 0; i < funcButtons.length; i++){
            form.appendChild(funcButtons[i]);
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

    generateFunctionButtons(){
        //generate the determinate button
        let determinateButton = document.createElement("input");
        determinateButton.id = "determinateButton-" + this.id.toString();
        determinateButton.type = "button";
        determinateButton.value = "Determinate";
        determinateButton.onclick = () => this.determinateClick(determinateButton);

        return [determinateButton];
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


    determinateClick(button){
        var result = -69;

        //uses 2x2 method
        if(this.length == 2 && this.width == 2){
            result = (this.vertices[0][0] * this.vertices[1][1]) - (this.vertices[0][1] * this.vertices[1][0])
        }
        else{

        }

        console.log(result);
    }

    clearTable() {
        //remove the current form from the matrix div
        this.getCurrDiv().removeChild(document.getElementById("matrixForm-" + this.id.toString()));
    }
}

var matrices = [new matrix(3, 3), new matrix(3, 3)];

document.body.onload = () => {
    for (var i = 0; i < 2; i++) {
        matrices[i].setUpTable();
    }
}