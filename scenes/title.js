class titleScreen extends Phaser.Scene {
  constructor() {
    super("titleScreen");
  }
  preload() {

  }
  create() {
    gameSettings = JSON.parse(localStorage.getItem('tetrisSettings'));
    if (gameSettings === null || gameSettings.length <= 0) {
      localStorage.setItem('tetrisSettings', JSON.stringify(defaultValues));
      gameSettings = defaultValues;
    }

    //  this.logo = this.add.image(game.config.width / 2, 200, 'logo').setOrigin(.5, .5).setScale(.7);
    this.title = this.add.bitmapText(game.config.width / 2, 125, 'topaz', 'TETRIS', 120).setOrigin(.5).setTint(0xbd250d);
    this.title.setLetterSpacing(10);
    this.tShape = this.add.image(75, 150, 'shapes', 1).setScale(1.5);
    this.jShape = this.add.image(750, 125, 'shapes', 5).setScale(1.5);
    this.directions = this.add.bitmapText(game.config.width / 2, 280, 'topaz', 'Choose a game mode and starting options', 30).setOrigin(.5).setTint(0xffffff);

    this.playAIcon = this.add.image(150, 850, 'icons', 4).setOrigin(0, .5).setInteractive();
    this.playBIcon = this.add.image(600, 850, 'icons', 4).setOrigin(0, .5).setInteractive();


    this.playTextA = this.add.bitmapText(50, 400, 'topaz', 'Play A', 70).setOrigin(0, .5).setTint(0xffffff);

    this.playTextA.setInteractive();

    this.levelA = this.add.bitmapText(50, 550, 'topaz', 'Level 1 >', 50).setOrigin(0, .5).setTint(0xd8a603).setInteractive();
    this.levelA.on('pointerdown', this.levelASelect, this);

    this.playAIcon.on('pointerdown', function () {
      this.scene.start("PlayGame");
    }, this);

    this.playTextB = this.add.bitmapText(550, 400, 'topaz', 'Play B', 70).setOrigin(0, .5).setTint(0xffffff);
    this.levelB = this.add.bitmapText(550, 550, 'topaz', 'Level 1 >', 50).setOrigin(0, .5).setTint(0xd8a603).setInteractive();
    this.levelB.on('pointerdown', this.levelBSelect, this);
    this.heightB = this.add.bitmapText(550, 700, 'topaz', 'Height 0 >', 50).setOrigin(0, .5).setTint(0xd8a603).setInteractive();
    this.heightB.on('pointerdown', this.heightBSelect, this);




    this.playTextB.setInteractive();
    this.playBIcon.on('pointerdown', function () {
      gameMode = 'b';


      this.scene.start("PlayGame");
    }, this);






    this.setText = this.add.bitmapText(game.config.width / 2, 1100, 'topaz', 'settings', 70).setOrigin(.5, .5).setTint(0xffffff);
    this.setText.setInteractive();
    this.settingIcon = this.add.image(game.config.width / 2, 1250, 'icons', 3).setOrigin(.5).setInteractive();

    this.settingIcon.on('pointerdown', function () {

      this.scene.start("settingsScreen");
    }, this);






  }

  levelASelect() {
    if (startLevel == 9) {
      startLevel = 1;
    } else {
      startLevel++
    }

    var tween = this.tweens.add({
      targets: this.levelA,
      alpha: 0,
      duration: 100,
      yoyo: true
    });
    this.levelA.setText('Level ' + startLevel + ' >');
  }


  levelBSelect() {
    if (startLevel == 9) {
      startLevel = 1;
    } else {
      startLevel++
    }

    var tween = this.tweens.add({
      targets: this.levelB,
      alpha: 0,
      duration: 100,
      yoyo: true
    });
    this.levelB.setText('Level ' + startLevel + ' >');
  }

  heightBSelect() {
    if (startHeight == 5) {
      startHeight = 0;
    } else {
      startHeight++
    }

    var tween = this.tweens.add({
      targets: this.heightB,
      alpha: 0,
      duration: 100,
      yoyo: true
    });
    this.heightB.setText('Height ' + startHeight + ' >');
  }

}