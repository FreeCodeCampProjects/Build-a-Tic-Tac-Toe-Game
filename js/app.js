(function() {

  /* ( x ) Here we define all "global" variables. Technically these are
          not globals because we have wrapped this document's code in
          an IIFE:
  **********************************************************************/

  var addAndThenRemoveClass,
      ANIMATIONS,
      cellButtons,
      cellButton1, 
      cellButton2,
      cellButton3,
      cellButton4,
      cellButton5,
      cellButton6,
      cellButton7,
      cellButton8,
      cellButton9,
      cellButton1V,
      cellButton2V,
      cellButton3V,
      cellButton4V,
      cellButton5V,
      cellButton6V,
      cellButton7V,
      cellButton8V,
      cellButton9V,
      cellElementIds,
      checkForAvailablePlayerCell,
      checkForAvailableComputerCell,
      checkForDraw,
      checkForLoss,
      checkForRow,
      checkGameResult,
      colourCells,
      computerSymbol,
      CONFIG,
      ConstructCellButton,
      ConstructCellButtons,
      createBorders,
      determineComputerMove,
      disableAllCellButtons,
      elemOutputFeedback,
      elemOutputTurn,
      elemRestartBtn,
      elemShareBtn,
      elemChangeSymbolBtn,
      feedbackEvent,
      generateCellButtons,
      getCellButtons,
      getPlayerSymbol,
      grid,
      mode,
      movesMade,
      playerTurnChangeAnimation,
      playerTurnChangeTimeVal,
      playerSymbol,
      resetGame,
      setCellButtons,
      STYLES,
      whoseTurn;

  /* ( x ) Cache elements as variables:
  **********************************************************************/

  elemOutputTurn = $('#output-turn')[0];
  elemOutputFeedback = $('#output-feedback')[0];
  elemChangeSymbolBtn = $('#elem-change-symbol-btn')[0];
  elemRestartBtn = $('#elem-restart-btn')[0];
  elemShareBtn = $('#elem-share-btn')[0];

  /* ( x ) UI button clicks call certain functions:
  **********************************************************************/

  $(elemChangeSymbolBtn).click(function() {
    resetGame();
    getPlayerSymbol();
  });

  $(elemRestartBtn).click(function() { resetGame(); });
  $(elemShareBtn).click(function() { alert(CONFIG.SYSTEM_MSG.SHARE) });

  /* ( x ) Useful variables (numbers and arrays) used throughout game:
  **********************************************************************/

  cellButtons = [];
  cellElementIds = [];
  mode = 1;
  movesMade = 0;
  playerTurnChangeTimeVal  = 600;
  whoseTurn = 0;

  /* ( x ) CONFIG object holds the most important values for the game,
           such as UI labels, symbols and the length of animations:
  **********************************************************************/

  CONFIG = {
    USER_FEEDBACK: {
      WHICH_SYMBOL: 'Which symbol would you like to play as?\n\n',
      NOT_RECOGNIZED: 'Did not recognize your choice. Please input only ',
      WIN: 'game won!',
      LOSE: 'game lost!',
      DRAW: 'game draw!',
      TURN: {
        COMPUTER: 'game turn',
        PLAYER: 'your turn'
      },
      ADDITIONAL_MESSAGES: {
        TOO_BAD: ['oh shucks!', 'no wayyy!', 'blimey!', 'gosh darnit...'],
        BETTER_LUCK_NEXT_TIME: 'better luck next time',
        KEEP_UP_GOOD_WORK: 'keep it up!',
        GOOD_JOB: ['good job!', 'outstanding'],
        DRAW_ZZZ: ['tictactoe sucks!', 'zzz...', 'borrring', 'sigh...']
      }
    },
    SYSTEM_MSG: {
        SHARE: 'SHARE function'
    },
    SYMBOLS: {
      X: ' X ',
      O: ' O ',
      EMPTY: '     '
    },
    ANIMATION_LENGTH: {
      QUICK: 200,
      MEDIUM: 500,
      SLOW: 800
    }
  };

  /* ( x ) STYLES object holds CSS style values for various elements:
  **********************************************************************/

  STYLES = {
    TURN: {
      COMPUTER: '#00FFFF', // cyan
      PLAYER: '#00FF00' // lime
    },
    WIN: '#00FF00', // lime
    LOSS: '#FF0000', // red
    DRAW: '#FFA500', // orange
    GRID_BORDER: '1px solid #E67E22',
    DEFAULT_COL: '#FFF' // white
  };

  /* ( x ) 'addAndThenRemoveClass' is self-explanatory. It is used for
           the animate.css library so as animations can occur on the
           same element more than once without any issues:
  **********************************************************************/

  addAndThenRemoveClass = function(o) {
    $(o.element).addClass(o.class);
    setTimeout(function() { $(o.element).removeClass(o.class); }, o.timeout);
  };

  /* ( x ) This function colours an array of cells:
  **********************************************************************/

  colourCells = function (row, colVal) {
    for (let i = 0; i < row.length; i++) {
      $('#cellButton' + row[i]).css('color', colVal);
    }
  };

  /* ( x ) 'getPlayerSymbol' prompts the user to pick a symbol (x or o):
  **********************************************************************/

  getPlayerSymbol = function() {
    let pickSymbol = prompt(CONFIG.USER_FEEDBACK.WHICH_SYMBOL + CONFIG.SYMBOLS.X.trim() + ' or ' + CONFIG.SYMBOLS.O.trim() + '?', CONFIG.SYMBOLS.X.trim());
    if (!pickSymbol) {
      getPlayerSymbol();
      return false;
    }
    if (pickSymbol.trim().toLowerCase() == CONFIG.SYMBOLS.X.trim().trim().toLowerCase()) {
      playerSymbol = CONFIG.SYMBOLS.X;
      computerSymbol = CONFIG.SYMBOLS.O;
    } else if (pickSymbol.trim().toLowerCase() == CONFIG.SYMBOLS.O.trim().toLowerCase()) {
      playerSymbol = CONFIG.SYMBOLS.O;
      computerSymbol = CONFIG.SYMBOLS.X;
    } else {
      alert(CONFIG.USER_FEEDBACK.NOT_RECOGNIZED + '"' + CONFIG.SYMBOLS.X.trim() + '" or "' + CONFIG.SYMBOLS.O.trim() + '".');
      getPlayerSymbol();
    }
  };

  /* ( x ) ANIMATIONS is an object that contains functions related to
           the way we animate elements within the game:
  **********************************************************************/

  ANIMATIONS = {
    FEEDBACK_EVENT: {
      CONSTRUCTOR: function(o) {
        elemOutputFeedback.innerHTML = o.messageLower[Math.floor(Math.random() * o.messageLower.length)];
        elemOutputTurn.style.color = o.textColour
        elemOutputTurn.innerHTML = o.messageUpper;
        elemOutputFeedback.style.opacity = 0;
        setTimeout(function() {  $(elemOutputFeedback).animate({ opacity: 1 }, CONFIG.ANIMATION_LENGTH.MEDIUM); }, CONFIG.ANIMATION_LENGTH.QUICK);
        setTimeout(function() { $(elemOutputFeedback).animate({ opacity: 0 }, CONFIG.ANIMATION_LENGTH.MEDIUM); }, 2500);
        setTimeout(function() { $(elemOutputFeedback).animate({ opacity: 1 }, CONFIG.ANIMATION_LENGTH.QUICK / 2); 
          elemOutputFeedback.innerHTML = o.messageLower2;
        }, 3500);
        setTimeout(function() { $(elemOutputFeedback).animate({ opacity: 0 }, CONFIG.ANIMATION_LENGTH.SLOW); 
          setTimeout(function() { elemOutputFeedback.innerHTML = '<br/>'; }, CONFIG.ANIMATION_LENGTH.SLOW);
        }, 5000);
      }
    }
  };

  /* ( x ) 'feedbackEvent' outputs text when the game has finished to
           inform the player of a win, loss or draw:
  **********************************************************************/

  feedbackEvent = {
    win: function(row) {
      colourCells(row, STYLES.WIN);
      ANIMATIONS.FEEDBACK_EVENT.CONSTRUCTOR({
        messageUpper: CONFIG.USER_FEEDBACK.WIN,
        messageLower: CONFIG.USER_FEEDBACK.ADDITIONAL_MESSAGES.GOOD_JOB,
        messageLower2: CONFIG.USER_FEEDBACK.ADDITIONAL_MESSAGES.KEEP_UP_GOOD_WORK,
        textColour: STYLES.WIN
      });
      disableAllCellButtons(true);
      setTimeout(function() {
        addAndThenRemoveClass({ element: '.container', class: 'animated rubberBand', timeout: 1000 });
        resetGame();
      }, 4500);
    },
    lose: function(row) {
      playerTurnChangeTimeVal = 2500;
      colourCells(row, STYLES.LOSS);
      ANIMATIONS.FEEDBACK_EVENT.CONSTRUCTOR({
        messageUpper: CONFIG.USER_FEEDBACK.LOSE,
        messageLower: CONFIG.USER_FEEDBACK.ADDITIONAL_MESSAGES.TOO_BAD,
        messageLower2: CONFIG.USER_FEEDBACK.ADDITIONAL_MESSAGES.BETTER_LUCK_NEXT_TIME,
        textColour: STYLES.LOSS
      });
      disableAllCellButtons(true);
      setTimeout(function() {
        addAndThenRemoveClass({ element: '.container', class: 'animated rubberBand', timeout: 1000 });
        resetGame();
        playerTurnChangeTimeVal = 800;
      }, 4500);
    },
    draw: function() {
      colourCells([1, 2, 3, 4, 5, 6, 7, 8, 9], STYLES.DRAW);
      playerTurnChangeTimeVal = 2500;
      ANIMATIONS.FEEDBACK_EVENT.CONSTRUCTOR({
        messageUpper: CONFIG.USER_FEEDBACK.DRAW,
        messageLower: CONFIG.USER_FEEDBACK.ADDITIONAL_MESSAGES.DRAW_ZZZ,
        messageLower2: '<br>',
        textColour: STYLES.DRAW
      });
      disableAllCellButtons(true);
      setTimeout(function() {
        addAndThenRemoveClass({ element: '.container', class: 'animated rubberBand', timeout: 1000 });
        resetGame();
        playerTurnChangeTimeVal = 800;
      }, 2500);
    }
  };

  /* ( x ) Peform checks to see if user has won, lost or drawn the game:
  **********************************************************************/

  checkGameResult = function() {
      checkForAvailableComputerCell();
      checkForLoss();
      checkForDraw();
  };

  /* ( x ) Create grid and append it to the gameboard DIV element:
  **********************************************************************/

  grid = {
    create: function() {
      let table;
      table = document.createElement('table');
      table.id = 'grid';
      table.className = 'grid';
      $('#gameboard')[0].appendChild(table);
    },
    populate: function() {
      let col, cellName, i, j, row;
      for(i = 0; i < 3; i++) {
      row = $('#grid')[0].insertRow();
        for (j = 0; j < 3; j++) {
          cellName = 'r' + (i + 1) + 'c' + (j + 1);
          col = row.insertCell();
          col.innerHTML = '<div class="cell" id="' + cellName + '">' + '&nbsp;' + '</div>';
          cellElementIds.push(cellName);
        }
      }
    }
  };

  /* ( x ) Create lines for game grid by styling cell buttons with CSS
           border-top and border-right:
  **********************************************************************/

  createBorders = function() {
    let gridBorder = {
      style: STYLES.GRID_BORDER,
      top:   ['cellButton4', 'cellButton5', 'cellButton6', 'cellButton7', 'cellButton8', 'cellButton9'],
      right: ['cellButton1', 'cellButton2', 'cellButton4', 'cellButton5', 'cellButton7', 'cellButton8']
    };
    gridBorder.right.forEach(function(element, index, arr) {
      $('#' + element)[0].style.borderRight = gridBorder.style;
    });
    gridBorder.top.forEach(function(element, index, arr) {
      $('#' + element)[0].style.borderTop = gridBorder.style;
    });
  };

  /* ( x ) 'disableAllCellButtons' does what it says. It is useful for
          when the game has finished and we don't want the user to
          further interact with the — while still displaying it:
  **********************************************************************/

  disableAllCellButtons = function(truthValue) {
    $('.cell-button').each(function(i) {
      this.disabled = truthValue;
    });
  };

  /* ( x ) Set cell button states to 0:
  **********************************************************************/

  setCellButtons = function() {
    cellButton1V = 0;
    cellButton2V = 0;
    cellButton3V = 0;
    cellButton4V = 0;
    cellButton5V = 0;
    cellButton6V = 0;
    cellButton7V = 0;
    cellButton8V = 0;
    cellButton9V = 0;
  };

  /* ( x ) Create array of cell buttons that will be appended to the
           game grid (along with their values and click events):
  **********************************************************************/

  generateCellButtons = function () {
    for (let i = 0; i < 9; i++) {
      cellButtons.push({
        nameVal: 'cellButton' + (i + 1),
        classVal: 'cell-button',
        valueVal: CONFIG.SYMBOLS.EMPTY,
        clickVal: 'if ($("#cellButton' + (i + 1) + '")[0].value == "' + CONFIG.SYMBOLS.EMPTY + '" && whoseTurn == 0 && mode == 1) { $("#cellButton' + (i + 1) + '")[0].value = "' + playerSymbol + '"; cellButton' + (i + 1) + 'V = 1; whoseTurn = 1; getCellButtons(); checkForRow();} else if ($("#cellButton' + (i + 1) + '")[0].value == "' + CONFIG.SYMBOLS.EMPTY + '" && whoseTurn == 1 && mode == 2) { $("#cellButton' + (i + 1) + '")[0].value = "' + playerSymbol + '"; cellButton' + (i + 1) + 'V = 1; whoseTurn = 0; getCellButtons(); player1Check() } else if ($("#cellButton' + (i + 1) + '")[0].value == "' + CONFIG.SYMBOLS.EMPTY + '" && whoseTurn == 0 && mode == 2) { $("#cellButton' + (i + 1 ) + '")[0].value = "' +  computerSymbol + '"; cellButton' + (i + 1) + 'V = 1; whoseTurn = 1; getCellButtons(); player1Check()} checkForDraw()'
      });
    }
  };

  /* ( x ) Schema by which cell buttons 
           (the square segments of the grid) are created:
  **********************************************************************/

  ConstructCellButton = function(o) {
    let cell = document.createElement('input');
    cell.id = o.idVal;
    cell.type = 'button';
    cell.className = o.classVal;
    cell.value = CONFIG.SYMBOLS.EMPTY;
    $('#' + cellElementIds[o.indexVal])[0].appendChild(cell);
    $('#' + cell.id)[0].onclick = function() { eval(o.clickVal); }
  };

  /* ( x ) Construct cell buttons (the square segments of the grid):
  **********************************************************************/

  ConstructCellButtons = function() {
    for (let i = 0; i < cellButtons.length; i++) {
      ConstructCellButton({
        indexVal: i,
        nameVal: cellButtons[i].nameVal,
        idVal: cellButtons[i].nameVal,
        classVal: cellButtons[i].classVal,
        valueVal: cellButtons[i].valueVal,
        clickVal: cellButtons[i].clickVal
      });
    }
  };

  /* ( x ) Cache the values of all cell buttons:
  **********************************************************************/

  getCellButtons = function() {
    cellButton1 = $('#cellButton1')[0].value;
    cellButton2 = $('#cellButton2')[0].value;
    cellButton3 = $('#cellButton3')[0].value;
    cellButton4 = $('#cellButton4')[0].value;
    cellButton5 = $('#cellButton5')[0].value;
    cellButton6 = $('#cellButton6')[0].value;
    cellButton7 = $('#cellButton7')[0].value;
    cellButton8 = $('#cellButton8')[0].value;
    cellButton9 = $('#cellButton9')[0].value;
  };

  /* ( x ) 'playerTurnChangeAnimation' performs a nice fade effect when
           the feedback text that tells you whose turn it is changes:
  **********************************************************************/

  playerTurnChangeAnimation = function(o) {
    o.elem.style.color = o.colVal;
    o.elem.style.opacity = o.fadeState.begin;
    $(o.elem).animate({ opacity: o.fadeState.end }, o.fadeState.len);
    o.elem.innerHTML = o.message;
  };

  /* ( x ) 'checkForRow' is self-evident; it checks if three cells of
           player's symbol form a row. If so, we call a win state:
  **********************************************************************/

  checkForRow = function() {
    if (cellButton1 == playerSymbol && cellButton2 == playerSymbol && cellButton3 == playerSymbol) feedbackEvent.win([1, 2, 3]);
    else if (cellButton4 == playerSymbol && cellButton5 == playerSymbol && cellButton6 == playerSymbol) feedbackEvent.win([4, 5, 6]);
    else if (cellButton7 == playerSymbol && cellButton8 == playerSymbol && cellButton9 == playerSymbol) feedbackEvent.win([7, 8, 9]);
    else if (cellButton1 == playerSymbol && cellButton5 == playerSymbol && cellButton9 == playerSymbol) feedbackEvent.win([1, 5, 9]);
    else if (cellButton1 == playerSymbol && cellButton4 == playerSymbol && cellButton7 == playerSymbol) feedbackEvent.win([1, 4, 7]);
    else if (cellButton2 == playerSymbol && cellButton5 == playerSymbol && cellButton8 == playerSymbol) feedbackEvent.win([2, 5, 8]);
    else if (cellButton3 == playerSymbol && cellButton6 == playerSymbol && cellButton9 == playerSymbol) feedbackEvent.win([3, 6, 9]);
    else if (cellButton1 == playerSymbol && cellButton5 == playerSymbol && cellButton9 == playerSymbol) feedbackEvent.win([1, 5, 9]);
    else if (cellButton3 == playerSymbol && cellButton5 == playerSymbol && cellButton7 == playerSymbol) feedbackEvent.win([3, 5, 7]);
    else checkGameResult();  
  };

  /* ( x ) Here we check rows to determine whether the player has lost:
  **********************************************************************/

  checkForLoss = function() {
    getCellButtons();
    checkForDraw();
    if (cellButton1 == computerSymbol && cellButton2 == computerSymbol && cellButton3 == computerSymbol) feedbackEvent.lose([1, 2, 3]);
    else if (cellButton4 == computerSymbol && cellButton5 == computerSymbol && cellButton6 == computerSymbol) feedbackEvent.lose([4, 5, 6]);
    else if (cellButton7 == computerSymbol && cellButton8 == computerSymbol && cellButton9 == computerSymbol) feedbackEvent.lose([7, 8, 9]);
    else if (cellButton1 == computerSymbol && cellButton5 == computerSymbol && cellButton9 == computerSymbol) feedbackEvent.lose([1, 5, 9]);
    else if (cellButton1 == computerSymbol && cellButton4 == computerSymbol && cellButton7 == computerSymbol) feedbackEvent.lose([1, 4, 7]);
    else if (cellButton2 == computerSymbol && cellButton5 == computerSymbol && cellButton8 == computerSymbol) feedbackEvent.lose([2, 5, 8]);
    else if (cellButton3 == computerSymbol && cellButton6 == computerSymbol && cellButton9 == computerSymbol) feedbackEvent.lose([3, 6, 9]);
    else if (cellButton1 == computerSymbol && cellButton5 == computerSymbol && cellButton9 == computerSymbol) feedbackEvent.lose([1, 5, 9]);
    else if (cellButton3 == computerSymbol && cellButton5 == computerSymbol && cellButton7 == computerSymbol) feedbackEvent.lose([3, 5, 7]);
  };

  /* ( x ) Here we check rows to determine whether the player has drawn:
  **********************************************************************/

  checkForDraw = function() {
    getCellButtons();
    movesMade = cellButton1V + cellButton2V + cellButton3V + cellButton4V + cellButton5V + cellButton6V + cellButton7V + cellButton8V + cellButton9V;
    if (movesMade == 9) feedbackEvent.draw();
  };

  /* ( x ) Here we check for cells not occupied by player symbols in
           order to determine where computer symbol can be inserted:
  **********************************************************************/

  checkForAvailableComputerCell = function() {
    checkForLoss();
    if (cellButton1 == computerSymbol && cellButton2 == computerSymbol && cellButton3V == 0 && whoseTurn == 1) {
      $('#cellButton3')[0].value = computerSymbol;
      cellButton3V = 1;
      whoseTurn = 0;
    } else if (cellButton2 == computerSymbol && cellButton3 == computerSymbol && cellButton1V == 0 && whoseTurn == 1) {
      $('#cellButton1')[0].value = computerSymbol;
      cellButton1V = 1;
      whoseTurn = 0;
    } else if (cellButton4 == computerSymbol && cellButton5 == computerSymbol && cellButton6V == 0 && whoseTurn == 1) {
      $('#cellButton6')[0].value = computerSymbol;
      cellButton6V = 1;
      whoseTurn = 0;
    } else if (cellButton5 == computerSymbol && cellButton6 == computerSymbol && cellButton4V == 0 && whoseTurn == 1) {
      $('#cellButton4')[0].value = computerSymbol;
      cellButton4V = 1;
      whoseTurn = 0;
    } else if (cellButton7 == computerSymbol && cellButton8 == computerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton8 == computerSymbol && cellButton9 == computerSymbol && cellButton7V == 0 && whoseTurn == 1) {
      $('#cellButton7')[0].value = computerSymbol;
      cellButton7V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == computerSymbol && cellButton5 == computerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton5 == computerSymbol && cellButton9 == computerSymbol && cellButton1V == 0 && whoseTurn == 1) {
      $('#cellButton1')[0].value = computerSymbol;
      cellButton1V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == computerSymbol && cellButton5 == computerSymbol && cellButton7V == 0 && whoseTurn == 1) {
      $('#cellButton7')[0].value = computerSymbol;
      cellButton7V = 1;
      whoseTurn = 0;
    } else if (cellButton7 == computerSymbol && cellButton5 == computerSymbol && cellButton3V == 0 && whoseTurn == 1) {
      $('#cellButton3')[0].value = computerSymbol;
      cellButton3V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == computerSymbol && cellButton3 == computerSymbol && cellButton2V == 0 && whoseTurn == 1) {
      $('#cellButton2')[0].value = computerSymbol;
      cellButton2V = 1;
      whoseTurn = 0;
    } else if (cellButton4 == computerSymbol && cellButton6 == computerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol;
      cellButton5V = 1;
      whoseTurn = 0;
    } else if (cellButton7 == computerSymbol && cellButton9 == computerSymbol && cellButton8V == 0 && whoseTurn == 1) {
      $('#cellButton8')[0].value = computerSymbol;
      cellButton8V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == computerSymbol && cellButton7 == computerSymbol && cellButton4V == 0 && whoseTurn == 1) {
      $('#cellButton4')[0].value = computerSymbol;
      cellButton4V = 1;
      whoseTurn = 0;
    } else if (cellButton2 == computerSymbol && cellButton8 == computerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5').value = computerSymbol;
      cellButton5V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == computerSymbol && cellButton9 == computerSymbol && cellButton6V == 0 && whoseTurn == 1) {
      $('#cellButton6')[0].value = computerSymbol;
      cellButton6V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == computerSymbol && cellButton5 == computerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton4 == computerSymbol && cellButton7 == computerSymbol && cellButton1V == 0 && whoseTurn == 1) {
      $('#cellButton1')[0].value = computerSymbol;
      cellButton1V = 1;
      whoseTurn = 0;
    } else if (cellButton5 == computerSymbol && cellButton8 == computerSymbol && cellButton2V == 0 && whoseTurn == 1) {
      $('#cellButton2')[0].value = computerSymbol;
      cellButton2V = 1;
      whoseTurn = 0;
    } else if (cellButton6 == computerSymbol && cellButton9 == computerSymbol && cellButton3V == 0 && whoseTurn == 1) {
      $('#cellButton3')[0].value = computerSymbol;
      cellButton3V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == computerSymbol && cellButton4 == computerSymbol && cellButton7V == 0 && whoseTurn == 1) {
      $('#cellButton7')[0].value = computerSymbol;
      cellButton7V = 1;
      whoseTurn = 0;
    } else if (cellButton2 == computerSymbol && cellButton5 == computerSymbol && cellButton8V == 0 && whoseTurn == 1) {
      $('#cellButton8')[0].value = computerSymbol;
      cellButton8V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == computerSymbol && cellButton6 == computerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == computerSymbol && cellButton9 == computerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol;
      cellButton5V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == computerSymbol && cellButton7 == computerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol;
      cellButton5V = 1;
      whoseTurn = 0;
    } else {
      elemOutputTurn.innerHTML = CONFIG.USER_FEEDBACK.TURN.COMPUTER;
      elemOutputTurn.style.color = STYLES.TURN.COMPUTER;
      setTimeout(function() { checkForAvailablePlayerCell(); }, playerTurnChangeTimeVal );
    }
    checkForLoss();
  };

  /* ( x ) Here we check for cells not occupied by player symbols in
           order to determine where computer symbol can be inserted:
  **********************************************************************/

  checkForAvailablePlayerCell = function() {
    checkForLoss();
    if (cellButton1 == playerSymbol && cellButton2 == playerSymbol && cellButton3V == 0 && whoseTurn == 1) {
      $('#cellButton3')[0].value = computerSymbol;
      cellButton3V = 1;
      whoseTurn = 0;
    } else if (cellButton2 == playerSymbol && cellButton3 == playerSymbol && cellButton1V == 0 && whoseTurn == 1) {
      $('#cellButton1')[0].value = computerSymbol;
      cellButton1V = 1;
      whoseTurn = 0;
    } else if (cellButton4 == playerSymbol && cellButton5 == playerSymbol && cellButton6V == 0 && whoseTurn == 1) {
      $('#cellButton6')[0].value = computerSymbol;
      cellButton6V = 1;
      whoseTurn = 0;
    } else if (cellButton5 == playerSymbol && cellButton6 == playerSymbol && cellButton4V == 0 && whoseTurn == 1) {
      $('#cellButton4')[0].value = computerSymbol;
      cellButton4V = 1;
      whoseTurn = 0;
    } else if (cellButton7 == playerSymbol && cellButton8 == playerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton8 == playerSymbol && cellButton9 == playerSymbol && cellButton7V == 0 && whoseTurn == 1) {
      $('#cellButton7')[0].value = computerSymbol;
      cellButton7V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == playerSymbol && cellButton5 == playerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton5 == playerSymbol && cellButton9 == playerSymbol && cellButton1V == 0 && whoseTurn == 1) {
      $('#cellButton1')[0].value = computerSymbol;
      cellButton1V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == playerSymbol && cellButton5 == playerSymbol && cellButton7V == 0 && whoseTurn == 1) {
      $('#cellButton7')[0].value = computerSymbol;
      cellButton7V = 1;
      whoseTurn = 0;
    } else if (cellButton7 == playerSymbol && cellButton5 == playerSymbol && cellButton3V == 0 && whoseTurn == 1) {
      $('#cellButton3')[0].value = computerSymbol;
      cellButton3V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == playerSymbol && cellButton3 == playerSymbol && cellButton2V == 0 && whoseTurn == 1) {
      $('#cellButton2')[0].value = computerSymbol;
      cellButton2V = 1;
      whoseTurn = 0;
    } else if (cellButton4 == playerSymbol && cellButton6 == playerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol;
      cellButton5V = 1;
      whoseTurn = 0;
    } else if (cellButton7 == playerSymbol && cellButton9 == playerSymbol && cellButton8V == 0 && whoseTurn == 1) {
      $('#cellButton8')[0].value = computerSymbol;
      cellButton8V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == playerSymbol && cellButton7 == playerSymbol && cellButton4V == 0 && whoseTurn == 1) {
      $('#cellButton4')[0].value = computerSymbol;
      cellButton4V = 1;
      whoseTurn = 0;
    } else if (cellButton2 == playerSymbol && cellButton8 == playerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol;
      cellButton5V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == playerSymbol && cellButton9 == playerSymbol && cellButton6V == 0 && whoseTurn == 1) {
      $('#cellButton6')[0].value = computerSymbol;
      cellButton6V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == playerSymbol && cellButton5 == playerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton4 == playerSymbol && cellButton7 == playerSymbol && cellButton1V == 0 && whoseTurn == 1) {
      $('#cellButton1')[0].value = computerSymbol;
      cellButton1V = 1;
      whoseTurn = 0;
    } else if (cellButton5 == playerSymbol && cellButton8 == playerSymbol && cellButton2V == 0 && whoseTurn == 1) {
      $('#cellButton2')[0].value = computerSymbol;
      cellButton2V = 1;
      whoseTurn = 0;
    } else if (cellButton6 == playerSymbol && cellButton9 == playerSymbol && cellButton3V == 0 && whoseTurn == 1) {
      $('#cellButton3')[0].value = computerSymbol;
      cellButton3V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == playerSymbol && cellButton4 == playerSymbol && cellButton7V == 0 && whoseTurn == 1) {
      $('#cellButton7')[0].value = computerSymbol;
      cellButton7V = 1;
      whoseTurn = 0;
    } else if (cellButton2 == playerSymbol && cellButton5 == playerSymbol && cellButton8V == 0 && whoseTurn == 1) {
      $('#cellButton8')[0].value = computerSymbol;
      cellButton8V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == playerSymbol && cellButton6 == playerSymbol && cellButton9V == 0 && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      cellButton9V = 1;
      whoseTurn = 0;
    } else if (cellButton1 == playerSymbol && cellButton9 == playerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol;
      cellButton5V = 1;
      whoseTurn = 0;
    } else if (cellButton3 == playerSymbol && cellButton7 == playerSymbol && cellButton5V == 0 && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol
      cellButton5V = 1;
      whoseTurn = 0;
    } else {
      determineComputerMove();
    }
    checkForLoss();

    playerTurnChangeAnimation({
      elem: elemOutputTurn,
      colVal: STYLES.TURN.PLAYER,
      message: CONFIG.USER_FEEDBACK.TURN.PLAYER,
      fadeState: {
        begin: 0,
        end: 1,
        len: CONFIG.ANIMATION_LENGTH.QUICK
      }
    });
  };

  determineComputerMove = function() {
    getCellButtons()
    if ($('#cellButton5')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton5')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton5V = 1;
    } else if ($('#cellButton1')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton1')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton1V = 1;
    } else if ($('#cellButton9')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton9')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton9V = 1;
    } else if ($('#cellButton6')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton6')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton6V = 1;
    } else if ($('#cellButton2')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton2')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton2V = 1;
    } else if ($('#cellButton8')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton8')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton8V = 1;
    } else if ($('#cellButton3')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton3')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton3V = 1;
    } else if ($('#cellButton7')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton7')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton7V = 1;
    } else if ($('#cellButton4')[0].value == CONFIG.SYMBOLS.EMPTY && whoseTurn == 1) {
      $('#cellButton4')[0].value = computerSymbol;
      whoseTurn = 0;
      cellButton4V = 1;
    }
    checkForLoss();
  };

  /* ( x ) Reset the game and all values:
  **********************************************************************/

  resetGame = function() {
    $('#cellButton1')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton2')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton3')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton4')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton5')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton6')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton7')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton8')[0].value = CONFIG.SYMBOLS.EMPTY;
    $('#cellButton9')[0].value = CONFIG.SYMBOLS.EMPTY;
    
    setCellButtons();
    getCellButtons();
    disableAllCellButtons(false);
    whoseTurn = 0;
    movesMade = 0;
    colourCells([1, 2, 3, 4, 5, 6, 7, 8, 9], STYLES.DEFAULT_COL);
    
    playerTurnChangeAnimation({
      elem: elemOutputTurn,
      colVal: STYLES.TURN.PLAYER,
      message: CONFIG.USER_FEEDBACK.TURN.PLAYER,
      fadeState: {
        begin: 0,
        end: 1,
        len: CONFIG.ANIMATION_LENGTH.QUICK
      }
    });
  };

  /* ( x ) Call these functions upon IIFE invocation:
  **********************************************************************/

  getPlayerSymbol();
  grid.create();
  grid.populate();
  setCellButtons();
  generateCellButtons();
  ConstructCellButtons()
  createBorders();

  playerTurnChangeAnimation({
    elem: elemOutputTurn,
    colVal: STYLES.TURN.PLAYER,
    message: CONFIG.USER_FEEDBACK.TURN.PLAYER,
    fadeState: {
      begin: 0,
      end: 1,
      len: CONFIG.ANIMATION_LENGTH.QUICK
    }
  });
}());