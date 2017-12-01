/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/********************** Model **********************/
"use strict";
let playerTypeList = {
    'human': 'Player',
    'computer': 'ComputerPlayer'
};

let gameDataManagerSingleton = (function() {
    let _instance;

    function GameDataManager() {
        let playerId = 2;
        let _symbolCollection = [
            'X', 'O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
        ];

        let _playersCollection = [
            {id: 0, type: 'human', name: 'Player', symbol: _symbolCollection[0]},
            {id: 1, type: 'computer', name: 'Computer', symbol: _symbolCollection[1]}
        ];

        let _rows = 3;
        let _columns = 3;
        let _winLength = 3;

        let _availableSymbolList = (function() {
            let collection = _symbolCollection.slice(0);
            for (let j = 0; j < _playersCollection.length; j++) {
                collection.splice(collection.indexOf(_playersCollection[j].symbol), 1);
            }
            return collection;
        })();

        let isInteger = Number.isInteger || function(value) {
                return typeof value === 'number'
                    && isFinite(value)
                    && !(value % 1);
            };

        this.getRows = function() {
            return _rows;
        };

        this.getColumns = function() {
            return _columns;
        };

        this.getWinLength = function() {
            return _winLength;
        };

        this.getAvailableSymbolsList = function() {
            return _availableSymbolList.slice(0);
        };

        this.setRows = function(rows) {
            if (isInteger(rows)
                && rows > 2
                && rows <= 10
                && rows >= _playersCollection.length + 1) {
                _rows = rows;
                validateWinLength(rows);
            }
            return _rows;
        };

        this.setColumns = function(columns) {
            if (isInteger(columns)
                && columns > 2
                && columns <= 10
                && columns >= _playersCollection.length + 1) {
                _columns = columns;
                validateWinLength(columns);
            }
            return _columns;
        };

        this.setWinLength = function(winLength) {
            if (isInteger(winLength)
                && winLength > 2
                && winLength <= getDiagonal()) {
                _winLength = winLength;
            }
            return _winLength;
        };

        this.getPlayersCollection = function() {
            return _playersCollection.slice(0);
        };

        this.updatePlayer = function(id, prop, value) {
            let player = _playersCollection.find(function(item) {
                id = parseInt(id, 10);
                return item.id === id;
            });
            prop = prop.toLowerCase();

            if (!(player === undefined || prop === 'id')) {
                if (prop === 'type') {
                    for (let key in playerTypeList) {
                        if (key === value) {
                            player.type = value;
                        }
                    }
                }
                else if (prop === 'name' && !isPlayerNameOccupied(value)) {
                    player.name = value;
                }
                else if (prop === 'symbol' && _availableSymbolList.indexOf(value) >= 0) {
                    let oldPlayerSymbol = player.symbol;
                    player.symbol = value;
                    _availableSymbolList.splice(_availableSymbolList.indexOf(value), 1);
                    _availableSymbolList.push(oldPlayerSymbol);
                }
            }
            return player[prop];
        };

        this.addPlayer = function(type, name, symbol) {
            type = type.toLowerCase();
            if (canAddPlayer()
                && playerTypeList[type]
                && playerTypeList[type] !== undefined
                && _availableSymbolList.indexOf(symbol) >= 0) {

                let tempName = name;
                let index = 1;
                while (isPlayerNameOccupied(tempName)) {
                    tempName = name + '' + index;
                    index++;
                }
                let newPlayer = {id: playerId, type: type, name: tempName, symbol: symbol};
                playerId++;
                _playersCollection.splice(_playersCollection.length, 0, newPlayer);
                _availableSymbolList.splice(_availableSymbolList.indexOf(symbol), 1);
                return true;
            }
            return false;
        };

        this.removePlayer = function(id) {
            if (canRemovePlayer()) {
                for (let i = 0; i < _playersCollection.length; i++) {
                    if (_playersCollection[i].id === id) {
                        _availableSymbolList.push(_playersCollection[i].symbol);
                        _playersCollection.splice(i, 1);
                    }
                }
                return true;
            }
            return false;
        };

        function validateWinLength(x) {
            if (x < _winLength) {
                _winLength = x;
            }
        }

        function getDiagonal() {
            return (_columns - _rows) < 0 ? _columns : _rows;
        }

        function canAddPlayer() {
            return _playersCollection.length < getDiagonal() - 1;
        }

        function canRemovePlayer() {
            return _playersCollection.length > 2;
        }

        function isPlayerNameOccupied(name) {
            for (let i = 0; i < _playersCollection.length; i++) {
                if (_playersCollection[i].name === name) return true;
            }
            return false;
        }
    }

    return {
        getInstance: function() {
            if (!_instance) {
                _instance = new GameDataManager();
            }
            return _instance;
        }
    };
})();

let fieldSingleton = (function() {
    let _instance;

    function Field(rows, columns) {
        let _self = this;
        let _fieldCells = createFieldCells();

        this.getFieldCells = function() {
            return _fieldCells.map(function(arr) {
                return arr.slice();
            });
        };

        this.refreshFieldCells = function() {
            _fieldCells = createFieldCells();
        };

        this.updateCell = function(row, col, obj) {
            if (_fieldCells[row][col] === undefined) {
                _fieldCells[row][col] = obj;
                return true;
            }
            else {
                return false;
            }
        };

        this.getEmptyCells = function() {
            let emptyCells = [];

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    if (_fieldCells[r][c] === undefined) {
                        emptyCells.push({row: r, col: c});
                    }
                }
            }
            return emptyCells;
        };

        this.areCellsAvailable = function() {
            return _self.getEmptyCells().length > 0;
        };

        this.isCellInField = function(row, col) {
            return row >= 0
                && col >= 0
                && row < _fieldCells.length
                && col < _fieldCells[0].length;
        };

        function createFieldCells() {
            rows = gameDataManagerSingleton.getInstance().getRows();
            columns = gameDataManagerSingleton.getInstance().getColumns();
            let cells = new Array(rows);
            for (let i = 0; i < rows; i++) {
                cells[i] = new Array(columns);
            }
            return cells;
        }
    }

    return {
        getInstance: function() {
            if (!_instance) {
                let rows = gameDataManagerSingleton.getInstance().getRows();
                let columns = gameDataManagerSingleton.getInstance().getColumns();
                _instance = new Field(rows, columns);
            }
            return _instance;
        }
    };
})();

function WinnerChecker() {
    let _field = fieldSingleton.getInstance();
    let _winningLength = gameDataManagerSingleton.getInstance().getWinLength();
    let _directionPairsList = [
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    this.isWinnerFound = function(row, col, obj) {
        for (let i = 0; i < _directionPairsList.length; i++) {
            let winArray = [];
            let currentCell = {row: row, col: col, obj: obj};
            winArray.push(currentCell);

            for (let j = 0; j < _directionPairsList[i].length; j++) {
                let nextCell = getNextCell(currentCell, _directionPairsList[i][j]);
                while (nextCell !== null) {
                    winArray.push(nextCell);
                    if (winArray.length === _winningLength) {
                        return true;
                    }
                    nextCell = getNextCell(nextCell, _directionPairsList[i][j]);
                }
            }
        }
        return false;
    };

    function getNextCell(currentCell, direction) {
        let next;
        switch (direction) {
            case 0: /*up*/
                next = {row: currentCell.row - 1, col: currentCell.col, obj: currentCell.obj};
                break;
            case 1: /*top right*/
                next = {row: currentCell.row - 1, col: currentCell.col + 1, obj: currentCell.obj};
                break;
            case 2: /*right*/
                next = {row: currentCell.row, col: currentCell.col + 1, obj: currentCell.obj};
                break;
            case 3: /*down right*/
                next = {row: currentCell.row + 1, col: currentCell.col + 1, obj: currentCell.obj};
                break;
            case 4: /*down*/
                next = {row: currentCell.row + 1, col: currentCell.col, obj: currentCell.obj};
                break;
            case 5: /*down left*/
                next = {row: currentCell.row + 1, col: currentCell.col - 1, obj: currentCell.obj};
                break;
            case 6: /*left*/
                next = {row: currentCell.row, col: currentCell.col - 1, obj: currentCell.obj};
                break;
            case 7: /*top left*/
                next = {row: currentCell.row - 1, col: currentCell.col - 1, obj: currentCell.obj};
                break;
            default:
                next = null;
                break;
        }

        if (next !== null
            && _field.isCellInField(next.row, next.col)
            && _field.getFieldCells()[next.row][next.col] === currentCell.obj) {
            return next;
        } else {
            return null;
        }
    }
}

function Player(name, symbol) {
    this.playerName = name;
    this.playerSymbol = symbol;

    this.startMove = function(game) {};

    this.finishMove = function(row, col) {
        return fieldSingleton.getInstance().updateCell(row, col, this.playerSymbol);
    };
}

function ComputerPlayer(name, symbol) {
    Player.apply(this, arguments);

    this.startMove = function(game) {
        let randomCell = findRandomCell();
        game.finishTurn(randomCell.row, randomCell.col);
    };

    function findRandomCell() {
        let emptyCellsArr = fieldSingleton.getInstance().getEmptyCells();
        let min = 0;
        let max = emptyCellsArr.length > 0 ? emptyCellsArr.length - 1 : 0;
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        return emptyCellsArr[random];
    }
}

ComputerPlayer.prototype = Object.create(Player.prototype);
ComputerPlayer.prototype.constructor = ComputerPlayer;

function Iterator(array) {
    let _index = 0;

    this.getCurrent = function() {
        return array[_index];
    };

    this.moveNext = function() {
        _index = _index === array.length - 1 ? 0 : ++_index;
    };
}

function State(status, player, move, field) {
    this.currentStatus = status;
    this.currentPlayerName = player;
    this.currentMove = move;
    this.fieldCells = field;
}

function Game() {
    let _self = this;
    let _gameStatusList = ['Playing', 'Winner', 'Tie'];
    let _currentStatus = _gameStatusList[0];
    let _field = fieldSingleton.getInstance();
    let _winnerChecker = new WinnerChecker();
    let _iterator = new Iterator(getPlayersArray());
    let movesCounter = 1;

    _field.refreshFieldCells();

    this.state = getFreshState();

    this.startTurn = function() {
        _iterator.getCurrent().startMove(_self);
    };

    this.finishTurn = function(row, col) {
        if (_currentStatus === _gameStatusList[0] && _iterator.getCurrent().finishMove(row, col)) {
            if (_winnerChecker.isWinnerFound(row, col, _iterator.getCurrent().playerSymbol)) {
                _currentStatus = _gameStatusList[1];
            } else if (!_field.areCellsAvailable()) {
                _currentStatus = _gameStatusList[2];
            } else {
                _iterator.moveNext();
                _self.startTurn();
                movesCounter++;
            }
            _self.state = getFreshState();
        }
    };

    function getPlayersArray() {
        let array = [];
        let players = gameDataManagerSingleton.getInstance().getPlayersCollection();

        players.forEach(function(item) {
            array.push(new window[playerTypeList[item.type]](item.name, item.symbol));
        });
        return array;
    }

    function getFreshState() {
        let currentPlayerName = _iterator.getCurrent().playerName;
        return new State(_currentStatus, currentPlayerName, movesCounter, _field.getFieldCells());
    }
}