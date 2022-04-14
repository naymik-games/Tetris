class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("logo", "assets/logo.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("logo", "assets/logo.png");
    }








    this.load.bitmapFont("topaz", "assets/fonts/topaz.png", "assets/fonts/topaz.xml");



    this.load.audio("clearLine", "assets/audio/clear.wav");
    this.load.audio("nextLevel", "assets/audio/levelup.mp3");
    this.load.audio("pause", "assets/audio/pause.mp3");
    this.load.audio("gameover", "assets/audio/gameover.mp3");
    this.load.audio("tetris", "assets/audio/tetris.mp3");
    this.load.audio("move", "assets/audio/move.mp3");
    this.load.audio("rotate", "assets/audio/rot.mp3");
    this.load.audio("set", "assets/audio/set.mp3");


    this.load.audio("music1", "assets/audio/theme2.mp3");
    this.load.audio("background", "assets/audio/tetris.wav");

    this.load.image("particle", "assets/sprites/particle.png");;
    this.load.image("hero", "assets/hero.png");
    this.load.image("platform", "assets/platform.png");

    this.load.spritesheet("icons", "assets/game_icons.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("toggle", "assets/toggles.png", {
      frameWidth: 120,
      frameHeight: 66
    });
    this.load.spritesheet("blocksample", "assets/block_samples.png", {
      frameWidth: 200,
      frameHeight: 200
    });
    this.load.spritesheet("shapes", "assets/shapeicons.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field0", "assets/blocks0.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field1", "assets/blocks1.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field2", "assets/blocks2.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field3", "assets/blocks3.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field4", "assets/blocks4.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field5", "assets/blocks5.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field6", "assets/blocks6.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("field7", "assets/blocks7.png", {
      frameWidth: 100,
      frameHeight: 100
    });

  }
  create() {
    this.scene.start("titleScreen");
  }
}