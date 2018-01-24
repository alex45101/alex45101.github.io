var usernames = ["SmexyBoy130", "AstrologyMan", "Can_You_Dont", "edjr125", "Irsh_Walf", "Llamalpaca", "Negus-", "ShangYang28", "t00sp00ky4u", "TheSneakyAdolf", "Uvuvwevweonyete"];

var players = [];
var playingPlayers = [];

class Player {
    constructor(username, button) {
        this.username = username;
        this.button = button;
        this.isPlaying = false;
        this.hasUserInfo = false;
        this.team = -1;
        this.kd = 0;
        this.wlr = 0;
        this.playTime = 0;
        this.points = 0;
    }

    GetUserInfo() {
        if (!this.button.firstClick) {
            getUserStats(this.username, (response) => {
                console.log("Got " + this.username + "'s stats");
                this.hasUserInfo = true;

                if (this.isPlaying) {
                    this.button.classList.remove("btnLoading");                    
                    this.button.classList.add("btnLoaded");
                }

                let info = JSON.parse(response);

                this.kd = info.player.stats.casual.kd;
                this.wlr = info.player.stats.casual.wlr;
                this.playTime = info.player.stats.casual.playtime;

                if (info.player.stats.ranked.has_played) {
                    this.kd = (this.kd + info.player.stats.ranked.kd) / 2;
                    this.wlr = (this.wlr + info.player.stats.ranked.wlr) / 2;
                    this.playTime = info.player.stats.ranked.playtime;
                }

                this.points += this.kd / 0.1;
                this.points += this.kd / 0.075;
                this.points += ((this.playTime / 60) / 60) / 50;

                console.log("KD: " + this.kd);
                console.log("WLR: " + this.wlr);
                console.log("PlayTime: " + (this.playTime / 60) / 60);
                console.log("Points: " + this.points);
            });
        }
    }
}

document.body.onload = () => {
    setUpTable();
    setUpPlayerButtons();
}

function setUpTable() {
    let tableDiv = document.getElementById("teamLineUp");
    let table = document.createElement("TABLE");
    table.classList.add("center");

    for (var i = 0, count = 0; i < 5; i++) {
        let row = document.createElement("tr");
        for (var j = 0; j < 2; j++ , count++) {
            let cell = document.createElement("td");
            cell.style.border = "solid";
            cell.style.borderColor = "black";
            cell.style.padding = "15px 50px 15px 50px"
            cell.style.color = "white";

            cell.id = count;

            if (j % 2 == 0) {
                cell.team = "blue";
            }
            else {
                cell.team = "orange";
            }

            cell.style.backgroundColor = cell.team;

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    tableDiv.appendChild(table);
}

function setUpPlayerButtons() {
    let usernameDiv = document.getElementById("usernameButtons");

    for (let i = 0; i < usernames.length; i++) {
        let usernameButton = document.createElement("input");
        usernameButton.type = "button";
        usernameButton.value = usernames[i];
        usernameButton.selected = false;
        usernameButton.firstClick = false;
        usernameButton.classList.add("btn");

        players.push(new Player(usernameButton.value, usernameButton));
        players.isPlaying = false;

        usernameButton.onclick = (event) => {
            usernameButton.classList.remove("btnLoaded");
            usernameButton.classList.remove("btnLoading");
            usernameButton.selected = !usernameButton.selected;
            players[i].isPlaying = usernameButton.selected;

            if (!players[i].hasUserInfo) {
                players[i].GetUserInfo();
            }

            if (usernameButton.selected) {
                playingPlayers.push(players[i]);

                if (players[i].hasUserInfo) {                    
                    usernameButton.classList.add("btnLoaded");
                }
                else {                    
                    usernameButton.classList.add("btnLoading");
                }
            }
            else {
                playingPlayers.splice(findPlayingPlayerIndex(players[i]), 1);
                usernameButton.style.backgroundColor = "";
            }

            console.log(playingPlayers);
            usernameButton.firstClick = true;
        };

        usernameDiv.appendChild(usernameButton);
    }
}

function fillCell(row, team, text) {
    let cell = document.getElementById((row * 2) + team);
    cell.innerText = text;
}

function clearTable() {
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 2; j++) {
            fillCell(i, j, "");
        }
    }
}

function makeTeams(button) {
    clearTable();

    if (playingPlayers.length > 1 && playingPlayers.length <= 10) {
        if (button.value == "Skill") {
            putPlayersInSkillOrder(0, 0);
        }
        else if (button.value == "Spice") {
            putPlayersInSkillOrder(0, 2);
        }
        else if (button.value == "Random") {
            putPlayersInRandomOrder();
        }
    }
    else {
        alert("There is one player selected or more than 10 players are selected");
    }
}

function putPlayersInRandomOrder() {
    let temp = [];
    let length = playingPlayers.length;
    for (var i = 0; i < length; i++) {
        var randIndex = Math.floor(Math.random() * playingPlayers.length);
        temp.push(playingPlayers[randIndex]);
        playingPlayers.splice(randIndex, 1);
    }

    playingPlayers = temp;

    putPlayersInRandomTeams();
}

function putPlayersInRandomTeams() {
    for (var i = 0, j = 0; i < playingPlayers.length - 1; i += 2, j++) {
        playingPlayers[i].team = Math.floor(Math.random() * 2);
        fillCell(j, playingPlayers[i].team, playingPlayers[i].username);
        console.log(playingPlayers[i].username + " joined team " + playingPlayers[i].team);

        playingPlayers[i + 1].team = playingPlayers[i].team + 1;
        playingPlayers[i + 1].team %= 2;
        fillCell(j, playingPlayers[i + 1].team, playingPlayers[i + 1].username);
        console.log(playingPlayers[i + 1].username + " joined team " + playingPlayers[i + 1].team);
    }

    if (playingPlayers.length % 2 == 1) {
        playingPlayers[playingPlayers.length - 1].team = Math.floor(Math.random() * 2);
        fillCell(Math.floor(playingPlayers.length / 2), playingPlayers[playingPlayers.length - 1].team, playingPlayers[playingPlayers.length - 1].username);
        console.log(playingPlayers[playingPlayers.length - 1].username + " joined team " + playingPlayers[playingPlayers.length - 1].team);
    }
}

function putPlayersInSkillOrder(minOffset, maxOffset) {
    for (var i = 0; i < playingPlayers.length; i++) {
        if (!playingPlayers[i].hasUserInfo) {
            alert("Not all player stats have been loaded. Wait till everyone has green on their name to use the skill feature");
            return;
        }
    }

    console.log("everyone loaded in");

    var pointTotal = 0;

    for (var i = 0; i < playingPlayers.length; i++) {
        let offset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
        let operation = Math.floor(Math.random() * 2);

        if (operation % 2 == 0) {
            playingPlayers[i].points += offset;
        }
        else {
            playingPlayers[i].points -= offset;
        }

        pointTotal += playingPlayers[i].points;
    }

    console.log("Total Points: " + pointTotal);

    playingPlayers.sort((a, b) => { return b.points - a.points });

    putPlayersInRandomTeams();

    var teamPoints = [0, 0];

    for (var i = 0; i < playingPlayers.length; i++) {
        if (playingPlayers[i].team == 0) {
            teamPoints[0] += playingPlayers[i].points;
        }
        else {
            teamPoints[1] += playingPlayers[i].points;
        }
    }

    console.log("Blue Team Points: " + teamPoints[0]);
    console.log("Orange Team Points: " + teamPoints[1]);
}

function findPlayingPlayerIndex(username) {
    if (typeof username === "string") {
        for (var i = 0; i < players.length; i++) {
            if (username == players[i].username) {
                return i;
            }
        }
    }

    return -1;
}

function getUserStats(username, runMe) {
    let request = new XMLHttpRequest();

    request.open("GET", "https://api.r6stats.com/api/v1/players/" + username + "?platform=uplay", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status >= 200 && request.status < 300) {
            console.log("Request Post: " + request.responseText);
            runMe(request.responseText);
        }
    }

    request.send();
}