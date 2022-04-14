
window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x000000,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 850,
      height: 1450
    },
    pixelArt: true,
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true
    },
    scene: [preloadGame, titleScreen, settingsScreen, playGame, pauseGame]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}


class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {


  }
  create() {
    if (gameSettings.blockSet == 0) {
      blockKey = 'field0'
    } else if (gameSettings.blockSet == 1) {
      blockKey = 'field1'
    } else if (gameSettings.blockSet == 2) {
      blockKey = 'field2'
    } else if (gameSettings.blockSet == 3) {
      blockKey = 'field3'
    } else if (gameSettings.blockSet == 4) {
      blockKey = 'field4'
    } else if (gameSettings.blockSet == 5) {
      blockKey = 'field5'
    } else if (gameSettings.blockSet == 6) {
      blockKey = 'field6'
    } else if (gameSettings.blockSet == 7) {
      blockKey = 'field7'
    }
    level = startLevel;
    gameSettings = JSON.parse(localStorage.getItem('tetrisSettings'));

    this.cameras.main.setBackgroundColor(colors[0]);

    //audio

    this.back = this.sound.add('music1', { loop: true });
    if (gameSettings.music) {
      this.back.play();
    }
    this.clearLineAudio = this.sound.add('clearLine', { loop: false });
    this.nextLevelAudio = this.sound.add('nextLevel', { loop: false });
    this.pauseAudio = this.sound.add('pause', { loop: false });
    this.gameOverAudio = this.sound.add('gameover', { loop: false });
    this.tetrisAudio = this.sound.add('tetris', { loop: false });
    this.moveAudio = this.sound.add('move', { loop: false });
    this.rotateAudio = this.sound.add('rotate', { loop: false });
    this.setAudio = this.sound.add('set', { loop: false });

    //variables
    this.blockSize = 60;
    this.blockSizeMini = 30;
    this.totalCleared = 0;
    this.tetrisCount = 0;
    this.createBoard();
    this.createMiniBoard();

    //get the next available shape from the bag
    this.nextShape();

    //applies the shape to the grid
    this.applyShape();
    this.applyUpcomingShape();
    //set both save state and current state from the game
    saveState = this.getState();
    roundState = this.getState();


    //timer for game loop
    this.gameSpeed = this.time.addEvent({
      delay: speeds[level - 1],
      callback: this.gameLoop,
      callbackScope: this,
      loop: true
    });
    //this.gameSpeed.timeScale = speeds[0];

    // text set ups
    this.scoreLabelText = this.add.bitmapText(50, 50, 'topaz', 'Score:', 70).setOrigin(0, .5).setTint(0xffffff);
    this.scoreText = this.add.bitmapText(275, 50, 'topaz', score, 70).setOrigin(0, .5).setTint(0xd8a603);

    this.bestLabelText = this.add.bitmapText(575, 50, 'topaz', 'Score:', 40).setOrigin(0, .5).setTint(0xffffff);
    if (gameMode == 'a') {
      gameSettings.highScoreA = gameSettings.highScoreA.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.bestText = this.add.bitmapText(700, 50, 'topaz', gameSettings.highScoreA, 40).setOrigin(0, .5).setTint(0xff0000);
    } else {
      gameSettings.highScoreB = gameSettings.highScoreB.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.bestText = this.add.bitmapText(700, 50, 'topaz', gameSettings.highScoreB, 40).setOrigin(0, .5).setTint(0xff0000);
    }


    this.clearedLabelText = this.add.bitmapText(750, 300, 'topaz', 'Lines', 50).setOrigin(.5).setTint(0xffffff);

    if (gameMode == 'a') {
      this.clearedText = this.add.bitmapText(750, 400, 'topaz', this.totalCleared, 50).setOrigin(.5).setTint(0xd8a603);
    } else {
      this.clearedText = this.add.bitmapText(750, 400, 'topaz', 25 - this.totalCleared, 50).setOrigin(.5).setTint(0xd8a603);
    }


    this.levelLabelText = this.add.bitmapText(750, 500, 'topaz', 'Level', 50).setOrigin(.5).setTint(0xffffff);

    this.levelText = this.add.bitmapText(750, 600, 'topaz', level, 50).setOrigin(.5).setTint(0xd8a603);


    this.restartIcon = this.add.image(750, 800, 'icons', 1).setInteractive();
    this.restartIcon.on("pointerdown", function () {
      this.scene.restart("PlayGame");

    }, this);

    this.homeIcon = this.add.image(750, 950, 'icons', 2).setInteractive();
    this.homeIcon.on("pointerdown", function () {
      this.scene.start("titleScreen");

    }, this);

    this.muteIcon = this.add.image(750, 1100, 'icons', 5).setInteractive();
    this.muteIcon.on("pointerdown", function () {
      var muted = this.game.sound.mute;
      if (muted) {
        this.game.sound.mute = false;
      } else {
        this.game.sound.mute = true;
      }

    }, this);

    this.pauseIcon = this.add.image(750, 1250, 'icons', 0).setInteractive();
    this.pauseIcon.on("pointerdown", function () {
      isPaused = true;
      if (gameSettings.sfx) {
        this.pauseAudio.play();
      }

      if (gameSettings.music) {
        this.back.pause();
      }

      this.rt.fill(0x000000, .8);
      this.scene.pause();
      this.scene.launch('pauseGame');
    }, this);

    this.input.on('pointerup', this.endSwipe, this);

    //this.input.on('pointerover', this.overSwipe, this);



    this.speedText = this.add.text(750, 660, speeds[speedIndex], {
      font: "bold 30px Arial",
      align: "center",
      color: "#ffffff"
    });
    this.speedText.setOrigin(0.5).setInteractive();
    this.speedText.on('pointerdown', this.testFunction, this);






    this.iShape = this.add.image(106, game.config.height - 50, 'shapes', 0).setInteractive();
    this.iShape.on('pointerdown', function () {
      if (gameSettings.cheat == false) { return }
      this.changeShape('I');

    }, this);
    this.tShape = this.add.image(212, game.config.height - 50, 'shapes', 1).setInteractive();
    this.tShape.on('pointerdown', function () {
      if (gameSettings.cheat == false) { return }
      this.changeShape('T');
    }, this);
    this.sShape = this.add.image(318, game.config.height - 50, 'shapes', 2).setInteractive();
    this.sShape.on('pointerdown', function () {
      if (gameSettings.cheat == false) { return }
      this.changeShape('S');
    }, this);
    this.zShape = this.add.image(424, game.config.height - 50, 'shapes', 3).setInteractive();
    this.zShape.on('pointerdown', function () {
      if (gameSettings.cheat == false) { return }
      this.changeShape('Z');
    }, this);
    this.lShape = this.add.image(530, game.config.height - 50, 'shapes', 4).setInteractive();
    this.lShape.on('pointerdown', function () {
      if (gameSettings.cheat == false) { return }
      this.changeShape('L');
    }, this);
    this.jShape = this.add.image(636, game.config.height - 50, 'shapes', 5).setInteractive();
    this.jShape.on('pointerdown', function () {
      if (gameSettings.cheat == false) { return }
      this.changeShape('J');
    }, this);
    this.oShape = this.add.image(742, game.config.height - 50, 'shapes', 6).setInteractive();
    this.oShape.on('pointerdown', function () {
      if (gameSettings.cheat == false) { return }
      this.changeShape('O');
    }, this);

    this.rt = this.add.renderTexture(0, 0, game.config.width, game.config.height).setDepth(2);
    //this.shade = this.add.renderTexture(50, 120, this.blockSize * 10, this.blockSize * 1).setDepth(2);
    this.shade2 = this.add.image(50, 120, 'platform').setOrigin(0, 0).setAlpha(0);
    this.shade2.displayWidth = this.blockSize * 10;



    this.border = new Phaser.Geom.Rectangle();
    var graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xf5844c } });

    var rect = new Phaser.Geom.Rectangle(44, 114, (this.blockSize * 10) + 12, (this.blockSize * 20) + 12);
    graphics.strokeRectShape(rect);


    //this.border = new Phaser.Geom.Rectangle();

    //var graphics2 = this.add.graphics({ lineStyle: { width: 3, color: 0xf5844c } });
    var rect2 = new Phaser.Geom.Rectangle(694, 114, (this.blockSizeMini * 4) + 12, (this.blockSizeMini * 4) + 12);
    graphics.strokeRectShape(rect2);

  }

  update() {
    this.scoreText.setText(score);
    if (isPaused == false) {
      this.rt.clear();
    }

  }
  gameLoop() {
    draw = true;
    this.moveDown();


  }


  //touch control	
  overSwipe(e) {
    console.log('curr' + e.x)
    console.log('prev' + e.prevPosition.x)
  }

  endSwipe(e) {
    if (e.downX > 50 + this.blockSize * WIDTH || e.downY > 120 + this.blockSize * HEIGHT) {
      return
    } else {
      var swipeTime = e.upTime - e.downTime;
      var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);

      var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
      var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);

      if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
        if (swipeNormal.x > 0.8) { //right
          this.moveRight();
        }
        if (swipeNormal.x < -0.8) { //left
          this.moveLeft();
        }
        if (swipeNormal.y > 0.8) { //down
          this.hardDrop();
          //this.moveDown();
          score += 10;
        }
        if (swipeNormal.y < -0.8) { //up
          this.rotateShape();

        }
      } else if (swipeTime > 1000) { //long tap
        //	this.moveDown();
      } else if (swipeTime < 1000 && swipeMagnitude < 20) { //tap
        this.moveDown();
        score++;
      }




    }
  }
  testFunction() {
    this.speedText.setText('hi');
  }
  /////change speed
  changeSpeed() {
    this.gameSpeed.delay = speeds[level - 1];


    // this.gameSpeed.timeScale = speeds[speedIndex];
    this.cameras.main.setBackgroundColor(colors[level - 1]);
    this.speedText.setText(speeds[level - 1]);

  }
  /////change letter
  changeShape(letter) {
    this.removeShape();
    currentShape.shape = shapes[letter];
    this.applyShape();
  }
  hardDrop() {
    var result = { lose: false, moved: true, rowsCleared: 0 };

    this.removeShape();
    currentShape.y++;
    if (this.collides(grid, currentShape)) {
      currentShape.y--;
      this.setAudio.play();
      //apply (stick) it to the grid 
      this.applyShape();
      //move on to the next shape in the bag
      this.nextShape();
      this.reomoveUpcomingShape();
      this.applyUpcomingShape();
      //clear rows and get number of rows cleared
      result.rowsCleared = this.clearRows();
      //check again if this shape collides with our grid
      if (this.collides(grid, currentShape)) {
        //reset
        result.lose = true;
        //	this.scene.start("PlayGame");
        this.end = this.time.addEvent({
          delay: 800,
          callback: function () {
            this.endGame(false);
          },
          callbackScope: this,
          loop: false
        });


      }
      result.moved = false;
    } else {
      this.hardDrop();
    }
    this.applyShape();
    return result;
  }
  ////////move down
  moveDown() {
    //array of possibilities
    var result = { lose: false, moved: true, rowsCleared: 0 };
    //remove the shape, because we will draw a new one
    this.removeShape();

    //move it down the y axis
    currentShape.y++;
    //if it collides with the grid
    if (this.collides(grid, currentShape)) {
      //update its position
      currentShape.y--;
      this.setAudio.play();
      //apply (stick) it to the grid 
      this.applyShape();
      //move on to the next shape in the bag
      this.nextShape();
      this.reomoveUpcomingShape();
      this.applyUpcomingShape();
      //clear rows and get number of rows cleared
      result.rowsCleared = this.clearRows();
      //check again if this shape collides with our grid
      if (this.collides(grid, currentShape)) {
        //reset
        result.lose = true;
        //	this.scene.start("PlayGame");
        this.end = this.time.addEvent({
          delay: 800,
          callback: function () {
            this.endGame(false);
          },
          callbackScope: this,
          loop: false
        });


      }
      result.moved = false;
    }
    //apply shape, update the score and output the state to the screen
    this.applyShape();
    //	score++;
    if (result.rowsCleared > 0) {

    }
    //this.updateScore();
    this.output();
    return result;
  }
  /****
   * end game
   */
  endGame(win) {
    this.reomoveUpcomingShape();
    this.gameSpeed.remove();
    this.gameOverAudio.play();
    this.shade2.setAlpha(.6).setTint(0x475365);
    this.playAgain = this.add.bitmapText(50 + this.blockSize * WIDTH / 2, 600, 'topaz', 'PLAY AGAIN', 50).setOrigin(.5).setTint(0xd8a603).setAlpha(0).setInteractive();

    var tween = this.tweens.add({
      targets: this.shade2,
      displayHeight: this.blockSize * 20,
      duration: 1200
    });
    var tween = this.tweens.add({
      targets: this.shade2,
      alpha: .9,
      duration: 1000,
      delay: 1000
    });
    var tween = this.tweens.add({
      targets: this.playAgain,
      alpha: 1,
      duration: 500,
      delay: 1000
    });
    this.playAgain.on('pointerdown', function () {
      this.scene.start("titleScreen");
    }, this)
    if (gameMode == 'a') {
      if (gameSettings.highScoreA < score) {
        gameSettings.highScoreA = score;
        localStorage.setItem('tetrisSettings', JSON.stringify(gameSettings));
      }
    } else {
      if (gameSettings.highScoreB < score && win == true) {
        gameSettings.highScoreB = score;
        localStorage.setItem('tetrisSettings', JSON.stringify(gameSettings));
      }
    }
  }

  /**
   * Moves the current shape to the left if possible.
   */
  moveLeft() {
    //remove current shape, slide it over, if it collides though, slide it back
    this.removeShape();
    currentShape.x--;
    if (gameSettings.sfx) {
      this.moveAudio.play();
    }
    if (this.collides(grid, currentShape)) {
      currentShape.x++;
    }
    //apply the new shape
    this.applyShape();
  }

  /**
   * Moves the current shape to the right if possible.
   */
  //same deal
  moveRight() {
    this.removeShape();
    currentShape.x++;
    if (gameSettings.sfx) {
      this.moveAudio.play();
    }
    if (this.collides(grid, currentShape)) {
      currentShape.x--;
    }
    this.applyShape();
  }

  /**
   * Rotates the current shape clockwise if possible.
   */
  //slide it if we can, else return to original rotation
  rotateShape() {
    this.removeShape();
    currentShape.shape = this.rotate(currentShape.shape, 1);
    if (this.collides(grid, currentShape)) {
      currentShape.shape = this.rotate(currentShape.shape, 3);
    }
    if (gameSettings.sfx) {
      this.rotateAudio.play();
    }

    this.applyShape();
  }

  /**
   * Clears any rows that are completely filled.
   */
  clearRows() {
    //empty array for rows to clear
    var rowsToClear = [];
    //for each row in the grid
    for (var row = 0; row < grid.length; row++) {
      var containsEmptySpace = false;
      //for each column
      for (var col = 0; col < grid[row].length; col++) {
        //if its empty
        if (grid[row][col].value === 8) {
          //set this value to true
          containsEmptySpace = true;
        }
      }
      //if none of the columns in the row were empty
      if (!containsEmptySpace) {
        //add the row to our list, it's completely filled!
        rowsToClear.push(row);
        this.totalCleared++;

      }
    }
    //increase score for up to 4 rows. it maxes out at 12000
    if (rowsToClear.length == 1) {
      score += 40 * level;
      this.tetrisCount = 0;
      this.cameras.main.flash(250);
    } else if (rowsToClear.length == 2) {
      score += 100 * level;
      this.tetrisCount = 0;
      this.cameras.main.flash(500);
    } else if (rowsToClear.length == 3) {
      score += 300 * level;
      this.tetrisCount = 0;
      this.cameras.main.flash(750);
    } else if (rowsToClear.length >= 4) {
      var mult = 1;
      if (this.tetrisCount > 0) {
        mult = this.tetrisCount + 1;
      }
      score += (1200 * level) * mult;
      this.tetrisCount++;
      this.cameras.main.flash(1000);
      this.cameras.main.shake(500, 0.025);
    }
    //new array for cleared rows
    var rowsCleared = this.clone(rowsToClear.length);
    //for each value

    for (var toClear = rowsToClear.length - 1; toClear >= 0; toClear--) {
      //remove the row from the grid
      for (var i = 0; i < WIDTH; i++) {
        grid[rowsToClear[toClear]][i].setFrame(8);
        grid[rowsToClear[toClear]][i].value = 8;
      }

    }

    //shift the other rows
    if (rowsToClear.length > 0) {
      //this.totalCleared += rowsToClear.length;
      if (gameMode == 'a') {
        this.clearedText.setText(this.totalCleared);
      } else {
        this.clearedText.setText(25 - this.totalCleared);

      }

      var counter = rowsToClear.length;

      for (var i = rowsToClear[0] - 1; i >= 0; i--) {
        for (var j = 0; j < WIDTH; j++) {
          var y = i + counter;
          var block = grid[i][j];
          var nextblock = grid[i + counter][j];
          nextblock.setFrame(block.value);
          nextblock.value = block.value;
          block.setFrame(8);
          block.value = 8;
        }

      }

      if (gameSettings.sfx) {
        this.clearLineAudio.play();
      }


    }

    if (gameMode == 'a') {
      var templevel = level
      if (this.totalCleared % 10 == 0 && this.totalCleared > 1 && rowsToClear.length > 0) {
        level++;
        this.levelText.setText(level);
        this.changeSpeed();
        if (gameSettings.sfx) {
          this.nextLevelAudio.play();
        }
      }



    } else {
      if (25 - this.totalCleared <= 0) {
        this.end = this.time.addEvent({
          delay: 800,
          callback: function () {
            this.endGame(true);
          },
          callbackScope: this,
          loop: false
        });
      }
    }
    //return the rows cleared
    return rowsCleared;
  }

  /**
   * Applies the current shape to the grid.
   */
  applyShape() {
    //for each value in the current shape (row x column)
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        //if its non-empty
        if (currentShape.shape[row][col] !== 0) {
          //set the value in the grid to its value. Stick the shape in the grid!
          grid[currentShape.y + row][currentShape.x + col].value = currentShape.shape[row][col];
          grid[currentShape.y + row][currentShape.x + col].setFrame(currentShape.shape[row][col]);
        }
      }
    }
  }



  /**
   * Removes the current shape from the grid.
   */
  //same deal but reverse
  removeShape() {
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        if (currentShape.shape[row][col] !== 0) {
          grid[currentShape.y + row][currentShape.x + col].value = 8;
          grid[currentShape.y + row][currentShape.x + col].setFrame(8);
        }
      }
    }
  }

  /**
   * adds upcoming shape to mini grid
   */
  applyUpcomingShape() {

    //for each value in the current shape (row x column)
    for (var row = 0; row < upcomingShape.length; row++) {
      for (var col = 0; col < upcomingShape[row].length; col++) {
        //if its non-empty
        if (upcomingShape[row][col] !== 0) {
          //set the value in the grid to its value. Stick the shape in the grid!
          gridMini[upcomingShape.y + row][upcomingShape.x + col].setFrame(upcomingShape[row][col]);
        }
      }
    }
  }
  /**
   * remove upcoming shape to mini grid
   */
  reomoveUpcomingShape() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        gridMini[j][i].setFrame(8);
      }
    }
  }
  /**

   * Cycles to the next shape in the bag.

   */
  nextShape() {
    //increment the bag index
    bagIndex += 1;
    //if we're at the start or end of the bag
    if (bag.length === 0 || bagIndex == bag.length) {
      //generate a new bag of genomes
      this.generateBag();
    }
    //if almost at end of bag
    if (bagIndex == bag.length - 1) {
      //store previous seed
      var prevSeed = rndSeed;
      //generate upcoming shape
      upcomingShape = this.randomProperty(shapes);
      //set random seed
      rndSeed = prevSeed;
    } else {
      //get the next shape from our bag
      upcomingShape = shapes[bag[bagIndex + 1]];
    }
    //get our current shape from the bag
    currentShape.shape = shapes[bag[bagIndex]];
    //define its position
    currentShape.x = Math.floor(grid[0].length / 2) - Math.ceil(currentShape.shape[0].length / 2);
    currentShape.y = 0;
    upcomingShape.x = 0;

    upcomingShape.y = 0;
  }


  /**
   * Generates the bag of shapes.
   */
  generateBag() {
    bag = [];
    var contents = "";
    //7 shapes
    for (var i = 0; i < 7; i++) {
      //generate shape randomly
      var shape = this.randomKey(shapes);
      while (contents.indexOf(shape) != -1) {
        shape = this.randomKey(shapes);
      }
      //update bag with generated shape
      bag[i] = shape;
      contents += shape;
    }
    //reset bag index
    bagIndex = 0;
  }

  /**
   * Determines if the given grid and shape collide with one another.
   * @param  {Grid} scene  The grid to check.
   * @param  {Shape} object The shape to check.
   * @return {Boolean} Whether the shape and grid collide.
   */
  collides(scene, object) {
    //for the size of the shape (row x column)
    for (var row = 0; row < object.shape.length; row++) {
      for (var col = 0; col < object.shape[row].length; col++) {
        //if its not empty
        if (object.shape[row][col] !== 0) {
          //if it collides, return true
          if (scene[object.y + row] === undefined || scene[object.y + row][object.x + col] === undefined || scene[object.y + row][object.x + col].value !== 8) {
            return true;
          }
        }
      }
    }
    return false;
  }

  //for rotating a shape, how many times should we rotate
  rotate(matrix, times) {
    //for each time
    for (var t = 0; t < times; t++) {
      //flip the shape matrix
      matrix = this.transpose(matrix);
      //and for the length of the matrix, reverse each column
      for (var i = 0; i < matrix.length; i++) {
        matrix[i].reverse();
      }
    }
    return matrix;
  }
  //flip row x column to column x row
  transpose(array) {
    return array[0].map(function (col, i) {
      return array.map(function (row) {
        return row[i];
      });
    });
  }

  /**
   * Outputs the state to the screen.
   */
  output() {
    if (draw) {

      // console.log('j is y ' + grid.length);
      //  console#.log('i is x' + grid[0].length);

    }
    /*var output = document.getElementById("output");
      var html = "<h1>TetNet</h1><h5>Evolutionary approach to Tetris AI</h5>var grid = [";
      var space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      for (var i = 0; i < grid.length; i++) {
        if (i === 0) {
          html += "[" + grid[i] + "]";
        } else {
          html += "<br />" + space + "[" + grid[i] + "]";
        }
      }
      html += "];";
      for (var c = 0; c < colors.length; c++) {
        html = replaceAll(html, "," + (c + 1), ",<font color=\"" + colors[c] + "\">" + (c + 1) + "</font>");
        html = replaceAll(html, (c + 1) + ",", "<font color=\"" + colors[c] + "\">" + (c + 1) + "</font>,");
      }
      output.innerHTML = html;
    */

  }

  createBoard() {
    grid = [];
    //if gameMode is a, always do value 8. If b, then probablility that is will be another color.
    //j x


    for (var i = 0; i < HEIGHT; i++) {
      var col = [];
      for (var j = 0; j < WIDTH; j++) {
        if (i > HEIGHT - (startHeight + 4) && gameMode == "b") {
          var garbage = Phaser.Math.Between(1, 100);
          if (garbage < 50) {
            var rancolor = Phaser.Math.Between(1, 7);
            var block = this.add.image(50 + this.blockSize * j + this.blockSize / 2, 120 + this.blockSize * i + this.blockSize / 2, blockKey, rancolor);
            block.value = rancolor;
          } else {
            var block = this.add.image(50 + this.blockSize * j + this.blockSize / 2, 120 + this.blockSize * i + this.blockSize / 2, blockKey, 8);
            block.value = 8;
          }
        } else {
          var block = this.add.image(50 + this.blockSize * j + this.blockSize / 2, 120 + this.blockSize * i + this.blockSize / 2, blockKey, 8);
          block.value = 8;
        }
        block.displayWidth = this.blockSize;
        block.displayHeight = this.blockSize;

        //  block.value = this.level[j][i];
        col.push(block);
      }
      grid.push(col);
    }
    console.log('j is y ' + grid.length);
    console.log('i is x' + grid[0].length);

  }

  createMiniBoard() {

    gridMini = [];
    //j x
    for (var i = 0; i < 4; i++) {
      var col = [];
      for (var j = 0; j < 4; j++) {
        var block = this.add.image(700 + this.blockSizeMini * j + this.blockSizeMini / 2, 120 + this.blockSizeMini * i + this.blockSizeMini / 2, blockKey, 8);
        block.displayWidth = this.blockSizeMini;
        block.displayHeight = this.blockSizeMini;
        block.value = 8;
        //  block.value = this.level[j][i];
        col.push(block);
      }
      gridMini.push(col);
    }
    // console.log('j is y ' + grid.length);
    //  console.log('i is x' + grid[0].length);

  }
  /**
   * Returns the current game state in an object.
   * @return {State} The current game state.
   */
  getState() {
    var state = {
      grid: this.clone(grid),
      currentShape: this.clone(currentShape),
      upcomingShape: this.clone(upcomingShape),
      bag: this.clone(bag),
      bagIndex: this.clone(bagIndex),
      rndSeed: this.clone(rndSeed),
      score: this.clone(score)
    };
    return state;
  }

  /**
   * Loads the game state from the given state object.
   * @param  {State} state The state to load.
   */
  loadState(state) {
    grid = this.clone(state.grid);
    currentShape = this.clone(state.currentShape);
    upcomingShape = this.clone(state.upcomingShape);
    bag = this.clone(state.bag);
    bagIndex = this.clone(state.bagIndex);
    rndSeed = this.clone(state.rndSeed);
    score = this.clone(state.score);
    this.output();
    // 	updateScore();
  }

  /**
   * Clones an object.
   * @param  {Object} obj The object to clone.
   * @return {Object}     The cloned object.
   */
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }


  /**
   * Returns a random property key from the given object.
   * @param  {Object} obj The object to select a property key from.
   * @return {Property}     A random property key.
   */
  randomKey(obj) {
    var keys = Object.keys(obj);
    var i = this.seededRandom(0, keys.length);
    return keys[i];
  }

  replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
  }
  /**
   * Returns a random property from the given object.
   * @param  {Object} obj The object to select a property from.
   * @return {Property}     A random property.
   */
  randomProperty(obj) {
    return (obj[this.randomKey(obj)]);
  }

  /**
   * Returns a random number that is determined from a seeded random number generator.
   * @param  {Number} min The minimum number, inclusive.
   * @param  {Number} max The maximum number, exclusive.
   * @return {Number}     The generated random number.
   */
  seededRandom(min, max) {
    max = max || 1;
    min = min || 0;

    rndSeed = (rndSeed * 9301 + 49297) % 233280;
    var rnd = rndSeed / 233280;

    return Math.floor(min + rnd * (max - min));
  }

  randomNumBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randomWeightedNumBetween(min, max) {
    return Math.floor(Math.pow(Math.random(), 2) * (max - min + 1) + min);
  }

  randomChoice(propOne, propTwo) {
    if (Math.round(Math.random()) === 0) {
      return clone(propOne);
    } else {
      return clone(propTwo);
    }
  }

  contains(a, obj) {
    var i = a.length;
    while (i--) {
      if (a[i] === obj) {
        return true;
      }
    }
    return false;
  }

}



