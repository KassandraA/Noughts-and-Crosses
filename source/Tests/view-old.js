/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** View **********************/
"use strict";

let viewModel = new ViewModel();
let occupiedCells;
let playField = document.querySelector('#play_field');
let playFieldBody = document.querySelector("#play_field_body");
let rowsInput = document.querySelector('#rowsInput');
let columnsInput = document.querySelector('#columnsInput');
let winLengthInput = document.querySelector('#winLengthInput');
let playerInstancesCollection = document.querySelector('#player_instances_collection');
let template = document.querySelector('#player_instance_template');
let settingsContainer = document.querySelector('#settings_container');
let gameFieldContainer = document.querySelector('#game_field_container');
let refreshBtn = document.querySelector('.glyphicon-refresh');
let playBtn = document.querySelector('.glyphicon-play');
let settingsBtn = document.querySelector('.glyphicon-cog');
let gameTitle = document.querySelector('.game_title');
let elWidth = playFieldBody.offsetWidth;
let elHeight = playFieldBody.offsetHeight;

let symbolsImageArray = {
    'X': 'cross_green',
    'O': 'nought_blue',
    'A': 'square_orange',
    'B': 'triangle_purple',
    'C': 'cross_blue',
    'D': 'nought_orange',
    'E': 'square_purple',
    'F': 'triangle_green',
    'G': 'cross_orange',
    'H': 'nought_purple',
    'I': 'square_green',
    'J': 'triangle_blue',
    'K': 'cross_purple',
    'L': 'nought_green',
    'M': 'square_blue',
    'N': 'triangle_orange'
};

let playerTypesImageArray = {
    'human': 'player',
    'computer': 'computer'
};

// (function resize() {
// let elWidth = playFieldBody.offsetWidth;
// let elHeight = playFieldBody.offsetHeight;

// function doResize() {
//     let scale = Math.min(
//         playField.offsetWidth / elWidth,
//         playField.offsetHeight / elHeight
//     );
//     console.log('width: ' + playField.offsetWidth, elWidth);
//     console.log('height: ' + playField.offsetHeight, elHeight);
//     console.log(scale);
//     playFieldBody.style.transform = "scale(" + scale + ")";
// }

// })();

window.addEventListener("resize", doResize);
// window.addEventListener("load", doResize);

function getAvailableSymbolsList() {
    return viewModel.getAvailableSymbolsList();
}

/************ Starting game ************/
window.onload = function() {
    rowsInput.value = viewModel.getRows();
    columnsInput.value = viewModel.getColumns();
    winLengthInput.value = viewModel.getWinLength();
    doResize();
    let playersList = viewModel.getPlayersCollection();
    for (let i = 0; i < playersList.length; i++) {
        addPlayerInstance(playersList[i]);
    }
    updateSymbolsList();
    addToggleClass();
};

function addPlayerInstance(player) {
    playerInstancesCollection.appendChild(template.content.cloneNode(true));

    let playerInstancesList = document.getElementsByClassName('player_instance');
    let playerInstance = playerInstancesList[playerInstancesList.length - 1];
    let nameField = playerInstance.querySelector('.form-group .player_name');
    let typeUlContainer = playerInstance.querySelector('.dropdown-menu.player_type');
    let symbolLi = document.createElement('li');
    let symbolImg = document.createElement('img');

    playerInstance.setAttribute('id', player.id);
    nameField.value = player.name;
    symbolImg.setAttribute('src', 'images/' + symbolsImageArray[player.symbol] + '.png');
    symbolImg.setAttribute('alt', symbolsImageArray[player.symbol]);
    symbolLi.setAttribute('class', 'active');
    symbolLi.appendChild(symbolImg);
    playerInstance.querySelector('.dropdown-menu.player_symbol').appendChild(symbolLi);
    playerInstance.querySelector('.active_symbol').appendChild(symbolImg.cloneNode(true));
    createTypeList(player.type, typeUlContainer);
}

function updateSymbolsList() {
    let playerSymbolUList = document.querySelectorAll('.dropdown-menu.player_symbol');
    let availableSymbols = getAvailableSymbolsList();
    let activeSymbol = document.querySelectorAll('.active_symbol');

    for (let k = 0; k < playerSymbolUList.length; k++) {
        let activeLi = playerSymbolUList[k].querySelector('.active');
        playerSymbolUList[k].innerHTML = '';
        if (activeLi) playerSymbolUList[k].appendChild(activeLi);

        for (let i = 0; i < availableSymbols.length; i++) {
            let symbolLi = document.createElement('li');
            let symbolImg = document.createElement('img');

            symbolLi.appendChild(symbolImg);
            symbolImg.setAttribute('src', 'images/' + symbolsImageArray[availableSymbols[i]] + '.png');
            symbolImg.setAttribute('alt', availableSymbols[i]);
            symbolImg.addEventListener('click', function() {
                activeSymbol[k].removeChild(activeSymbol[k].firstChild);
                activeSymbol[k].appendChild(symbolImg.cloneNode(true));
                playerSymbolUList[k].querySelector('li').removeAttribute('class');
                this.closest('li').setAttribute('class', 'active');
            });
            playerSymbolUList[k].appendChild(symbolLi);
        }
    }
}

function createTypeList(playerType, container) {
    let playerTypeList = viewModel.getPlayerTypeList();
    let activeType = container.closest('.player_instance').querySelector('.active_type');

    for (let type in playerTypeList) {
        if (playerTypeList.hasOwnProperty(type)) {
            let typeLi = document.createElement('li');
            let typeImg = document.createElement('img');
            typeImg.setAttribute('src', 'images/' + playerTypesImageArray[type] + '.png');
            typeImg.setAttribute('alt', type);
            typeLi.appendChild(typeImg);

            if (playerType === type) {
                typeLi.setAttribute('class', 'active');
                activeType.appendChild(typeImg.cloneNode(true));
            }

            typeImg.addEventListener('click', function() {
                typeLi.removeAttribute('class');
                activeType.innerHTML = '';
                activeType.appendChild(typeImg.cloneNode(true));
                container.querySelector('li.active').removeAttribute('class');
                this.closest('li').setAttribute('class', 'active');
            });
            container.appendChild(typeLi);
        }
    }
}

function startGame() {
    let rows = viewModel.getRows();
    let columns = viewModel.getColumns();

    viewModel.startGame();
    createPlayFieldDiv(rows, columns);
    buildOccupiedCellsArray(rows, columns);
    updateFieldCellsContent();
    changeCurrentStatus();
    gameFieldShow();
    doResize();
}

function addToggleClass() {
    gameFieldContainer.classList.add('collapsed');
    // refreshBtn.classList.add('collapsed');
}

function settingsShow() {
    if (!gameFieldContainer.classList.contains('collapsed')
        && settingsContainer.classList.contains('collapsed')) {

        settingsContainer.classList.toggle('collapsed');
        gameFieldContainer.classList.toggle('collapsed');
        refreshBtn.classList.toggle('collapsed');
        playBtn.classList.toggle('collapsed');
        settingsBtn.classList.toggle('white');
        gameTitle.classList.toggle('orange');
    }
}

function gameFieldShow() {
    if (gameFieldContainer.classList.contains('collapsed')
        && !settingsContainer.classList.contains('collapsed')) {

        settingsContainer.classList.toggle('collapsed');
        gameFieldContainer.classList.toggle('collapsed');
        refreshBtn.classList.toggle('collapsed');
        playBtn.classList.toggle('collapsed');
        settingsBtn.classList.toggle('white');
        gameTitle.classList.toggle('orange');
    }
}

function createPlayFieldDiv(rows, columns) {
    playFieldBody.innerHTML = '';


    // let fieldBody = playField.appendChild(document.createElement('div'));
    // fieldBody.setAttribute('class', 'field_body');

    let flexColumn = playFieldBody.appendChild(document.createElement('div'));
    // flexColumn.setAttribute('id', 'play_field_body');
    flexColumn.setAttribute('class', 'flex_column');

    for (let r = 0; r < rows; r++) {
        let flexColumnItem = flexColumn.appendChild(document.createElement('div'));
        flexColumnItem.setAttribute('class', 'flex_column_item');

        let flexRow = flexColumnItem.appendChild(document.createElement('div'));
        flexRow.setAttribute('class', 'flex_row');

        for (let c = 0; c < columns; c++) {
            let fieldCell = flexRow.appendChild(document.createElement('div'));
            fieldCell.setAttribute('class', 'field_cell flex_row_item');
            fieldCell.setAttribute('id', r + '-' + c);
            flexRow.appendChild(fieldCell);
            setListenerToCell(fieldCell);
        }
    }


    playFieldBody.style.width = 100 * columns + 'em';
    playFieldBody.style.height = 100 * rows + 'em';


    // let el = document.querySelector('#play_field_body');
    // let cellArray = document.querySelectorAll('.field_cell');
    // let elHeight = window.getComputedStyle(el).getPropertyValue('height');
    // let elWidth = window.getComputedStyle(el).getPropertyValue('width');
    // let cellWidth, h, w;
    // h = parseInt(elHeight) / rows;
    // w = (parseInt(elWidth) / columns);
    // cellWidth = (h - w) > 0 ? w : h;
    // if (cellWidth > 150) cellWidth = 150;
    // cellArray.forEach(function(item, i, cellArray) {
    //     cellArray[i].style.width = cellWidth + 'px';
    //     cellArray[i].style.paddingBottom = cellWidth + 'px';
    // });


    /*
    if ((columns > 3) && (columns <= 5 )) {
        document.querySelector('.game_field').style.fontSize = '8px';
    }
    else if ((columns > 5) && (columns <= 7)) {
        document.querySelector('.game_field').style.fontSize = '6px';
    }
    else if (columns > 7) {
        document.querySelector('.game_field').style.fontSize = '4px';
    }
    */
}


function buildOccupiedCellsArray(rows, columns) {
    let arr = new Array(rows);

    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    occupiedCells = arr;
}

function setListenerToCell(cell) {
    cell.addEventListener("click", function() {
        let cellsRow = cell.id.split('-')[0];
        let cellsCol = cell.id.split('-')[1];

        viewModel.finishTurn(+cellsRow, +cellsCol);
        updateFieldCellsContent();
        changeCurrentStatus();
    });
}

function updateFieldCellsContent() {
    let fieldCellsArr = viewModel.getFieldCells();

    for (let r = 0; r < fieldCellsArr.length; r++) {
        for (let c = 0; c < fieldCellsArr[r].length; c++) {
            if (fieldCellsArr[r][c] !== undefined
                && occupiedCells[r][c] !== true) {

                let fieldCellImg = document.createElement('img');
                fieldCellImg.setAttribute('src', 'images/' + symbolsImageArray[fieldCellsArr[r][c]] + '.png');
                document.getElementById(r + '-' + c).appendChild(fieldCellImg);
                occupiedCells[r][c] = true;
            }
        }
    }
}

function changeCurrentStatus() {
    let playerNamesArr = document.querySelectorAll('.form-group .player_name');
    let statusDiv = document.querySelector('#gameStatus');
    let status = viewModel.getCurrentStatus();
    let move = 'Turn ' + viewModel.getCurrentMove();
    let name = viewModel.getPlayerName();
    let symbol;
    let statusLine;

    for (let i = 0; i < playerNamesArr.length; i++) {
        if (playerNamesArr[i].value === name) {
            symbol = playerNamesArr[i].closest('.player_instance').querySelector('.active_symbol').innerHTML;
        }
    }

    statusLine = [move, symbol, name];

    if (status === 'Tie') {
        statusLine = ['It is ', status];
    }
    else if (status === 'Winner') {
        statusLine = [status, symbol, name, ' on ', move];
    }
    statusDiv.innerHTML = statusLine.join(' ');
}

(function templatePolyfill(d) {
    if ('content' in d.createElement('template')) {
        return false;
    }

    let templ = d.getElementsByTagName('template'),
        elementTempl,
        templContent,
        documentContent;

    for (let x = 0; x < templ.length; ++x) {
        elementTempl = templ[x];
        templContent = elementTempl.childNodes;
        documentContent = d.createDocumentFragment();

        while (templContent[0]) {
            documentContent.appendChild(templContent[0]);
        }

        elementTempl.content = documentContent;
    }
})(document);


(function closestPolyfill(e){
    e.closest = e.closest || function(css){
            let node = this;

            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        }
})(Element.prototype);

(function matchesPolyfill(e) {
    e.matches || (e.matches = e.matchesSelector || function(selector) {
            let matches = document.querySelectorAll(selector), th = this;
            return Array.prototype.some.call(matches, function(e) {
                return e === th;
            });
        });

})(Element.prototype);

/************ Building rows and columns ************/
function increaseRows() {
    rowsInput.value = viewModel.setRows(+rowsInput.value + 1);
}

function decreaseRows() {
    rowsInput.value = viewModel.setRows(+rowsInput.value - 1);
    winLengthInput.value = viewModel.getWinLength();
}

function increaseColumns() {
    columnsInput.value = viewModel.setColumns(+columnsInput.value + 1);
}

function decreaseColumns() {
    columnsInput.value = viewModel.setColumns(+columnsInput.value - 1);
    winLengthInput.value = viewModel.getWinLength();
}

function increaseWinLength() {
    winLengthInput.value = viewModel.setWinLength(+winLengthInput.value + 1);
}

function decreaseWinLength() {
    winLengthInput.value = viewModel.setWinLength(+winLengthInput.value - 1);
}

/************ Building players ************/
function updatePlayer(element, prop) {
    let playerInstance = element.closest('.player_instance');
    let elementVal = element.value || element.querySelector('li.active > img').getAttribute('alt');
    let newVal = viewModel.updatePlayer(playerInstance.id, prop, elementVal);

    if (prop === 'name') {
        playerInstance.querySelector('.form-group .player_name').value = newVal;
    }
    if (prop === 'symbol') {
        updateSymbolsList();
    }
}

function addPlayer() {
    let defaultType = 'human';
    let defaultName = 'Player';
    let defaultSymbol = getAvailableSymbolsList()[0];
    if (viewModel.addPlayer(defaultType, defaultName, defaultSymbol)) {
        let list = viewModel.getPlayersCollection();
        let newPlayer = list[list.length - 1];
        addPlayerInstance(newPlayer);
        updateSymbolsList();
    }
}

function removePlayer(element) {
    let playerToRemove = element.closest('.player_instance');
    let id = parseInt(playerToRemove.id, 10);

    if (viewModel.removePlayer(id)) {
        playerInstancesCollection.removeChild(playerToRemove);
        updateSymbolsList();
    }
}

function doResize() {
    elWidth = playFieldBody.offsetWidth;
    elHeight = playFieldBody.offsetHeight;
    let scale = Math.min(
        playField.offsetWidth / elWidth,
        playField.offsetHeight / elHeight
    );
    console.log('width: ' + playField.offsetWidth, elWidth);
    console.log('height: ' + playField.offsetHeight, elHeight);
    console.log(scale);
    playFieldBody.style.transform = "scale(" + scale + ")";
}