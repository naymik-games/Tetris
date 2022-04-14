class settingsScreen extends Phaser.Scene {
  constructor() {
    super("settingsScreen");
  }
  preload() {

  }
  create() {
    this.settingsText = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'Settings', 70).setOrigin(.5, .5).setTint(0xffffff);
    //music toggle
    this.soundText = this.add.bitmapText(50, 200, 'topaz', 'SOUNDS ', 40).setOrigin(0, .5).setTint(0xffffff);

    this.sfxText = this.add.bitmapText(200, 300, 'topaz', 'Music: ', 50).setOrigin(0, .5).setTint(0xd8a603);
    this.musicToggle = this.add.image(400, 300, 'toggle', 0).setOrigin(0, .5).setScale(.8).setInteractive();
    if (gameSettings.music == true) {
      this.musicToggle.setFrame(2);
    }
    this.musicToggle.on('pointerdown', function () {
      this.musicToggle.setAlpha(.7);
    }, this);
    this.musicToggle.on('pointerup', function () {
      this.musicToggle.setAlpha(1);
      if (gameSettings.music == true) {
        gameSettings.music = false;
        this.musicToggle.setFrame(0);
      } else {
        gameSettings.music = true;
        this.musicToggle.setFrame(2);
      }
      localStorage.setItem('tetrisSettings', JSON.stringify(gameSettings));
    }, this);


    //sfx toggle

    this.sfxText = this.add.bitmapText(200, 400, 'topaz', 'SFX: ', 50).setOrigin(0, .5).setTint(0xd8a603);
    this.sfxToggle = this.add.image(400, 400, 'toggle', 0).setOrigin(0, .5).setScale(.8).setInteractive();
    if (gameSettings.sfx == true) {
      this.sfxToggle.setFrame(2);
    }
    this.sfxToggle.on('pointerdown', function () {
      this.sfxToggle.setAlpha(.7);
    }, this);
    this.sfxToggle.on('pointerup', function () {
      this.sfxToggle.setAlpha(1);
      if (gameSettings.sfx == true) {
        gameSettings.sfx = false;
        this.sfxToggle.setFrame(0);
      } else {
        gameSettings.sfx = true;
        this.sfxToggle.setFrame(2);
      }
      localStorage.setItem('tetrisSettings', JSON.stringify(gameSettings));
    }, this);

    //cheat toggle

    this.cheatText = this.add.bitmapText(200, 500, 'topaz', 'Cheat: ', 50).setOrigin(0, .5).setTint(0xd8a603);
    this.cheatToggle = this.add.image(400, 500, 'toggle', 0).setOrigin(0, .5).setScale(.8).setInteractive();
    if (gameSettings.cheat == true) {
      this.cheatToggle.setFrame(2);
    }
    this.cheatToggle.on('pointerdown', function () {
      this.cheatToggle.setAlpha(.7);
    }, this);
    this.cheatToggle.on('pointerup', function () {
      this.cheatToggle.setAlpha(1);
      if (gameSettings.cheat == true) {
        gameSettings.cheat = false;
        this.cheatToggle.setFrame(0);
      } else {
        gameSettings.cheat = true;
        this.cheatToggle.setFrame(2);
      }
      localStorage.setItem('tetrisSettings', JSON.stringify(gameSettings));
    }, this);

    //tile selection
    this.blockText = this.add.bitmapText(50, 600, 'topaz', 'BLOCKS ', 40).setOrigin(0, .5).setTint(0xffffff);

    //display sample image
    var temp = gameSettings.blockSet + 1;
    this.blockLabel = this.add.bitmapText(game.config.width / 2, 700, 'topaz', 'Block Set ' + temp, 50).setOrigin(.5).setTint(0xd8a603);
    this.sample = this.add.image(game.config.width / 2, 900, 'blocksample', gameOptions.blockSet).setOrigin(.5).setInteractive();;
    this.sample.on('pointerdown', this.changeBlock, this);
    //back to main
    this.backTo = this.add.bitmapText(game.config.width / 2, 1300, 'topaz', 'BACK', 70).setOrigin(.5, .5).setTint(0xffffff).setInteractive();
    this.backTo.on('pointerdown', function () {
      //  localStorage.setItem('tetrisSettings', JSON.stringify(gameSettings));
      this.scene.start("titleScreen");
    }, this);

  }

  changeBlock() {
    if (gameSettings.blockSet == 7) {
      gameSettings.blockSet = 0;
    } else {
      gameSettings.blockSet++;
    }
    var temp = gameSettings.blockSet + 1;
    this.blockLabel.setText('Block Set ' + temp);
    this.tweenSample(gameSettings.blockSet);
    localStorage.setItem('tetrisSettings', JSON.stringify(gameSettings));
  }

  tweenSample(frame) {

    var tween = this.tweens.add({
      targets: this.sample,
      alpha: 0,
      duration: 300,
      onComplete: function () {
        this.sample.setFrame(frame);
        var tween = this.tweens.add({
          targets: this.sample,
          alpha: 1,
          duration: 300,
        });
      },
      onCompleteScope: this,
    });
  }
}