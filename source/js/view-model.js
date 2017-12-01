/**
 * Created by Ksenia Annenko on 24.02.2017.
 */

/*********************** View-Model **********************/
"use strict";
function ViewModel() {
    let _game = null;

    this.startGame = function() {
        _game = new Game();
        _game.startTurn();
    };

    this.finishTurn = function(row, col) {
        if (_game) {
            _game.finishTurn(row, col);
        }
    };

    this.getFieldCells = function() {
        return _game.state.fieldCells;
    };

    this.getCurrentStatus = function() {
        return _game.state.currentStatus;
    };

    this.getPlayerName = function() {
        // return this.getCurrentStatus() === 'Tie' ? 'It' : _game.state.currentPlayerName;
        return _game.state.currentPlayerName;
    };

    this.getCurrentMove = function() {
        return _game.state.currentMove;
    };

    this.getRows = function() {
        return gameDataManagerSingleton.getInstance().getRows();
    };

    this.getColumns = function() {
        return gameDataManagerSingleton.getInstance().getColumns();
    };

    this.getWinLength = function() {
        return gameDataManagerSingleton.getInstance().getWinLength();
    };

    this.setRows = function(rows) {
        return gameDataManagerSingleton.getInstance().setRows(rows);
    };

    this.setColumns = function(cols) {
        return gameDataManagerSingleton.getInstance().setColumns(cols);
    };

    this.setWinLength = function(len) {
        return gameDataManagerSingleton.getInstance().setWinLength(len);
    };

    this.getPlayersCollection = function() {
        return gameDataManagerSingleton.getInstance().getPlayersCollection();
    };

    this.getAvailableSymbolsList = function() {
        return gameDataManagerSingleton.getInstance().getAvailableSymbolsList();
    };

    this.updatePlayer = function(id, prop, value) {
        return gameDataManagerSingleton.getInstance().updatePlayer(id, prop, value);
    };

    this.addPlayer = function(type, name, symbol) {
        return gameDataManagerSingleton.getInstance().addPlayer(type, name, symbol);
    };

    this.removePlayer = function(name) {
        return gameDataManagerSingleton.getInstance().removePlayer(name);
    };

    this.getPlayerTypeList = function() {
        return playerTypeList;
    };
}


