let game;
let gameOptions = {
  rows: 20,
  columns: 10,
  cellSize: 50,
  blocksPerLine: 8
}

//Define 10x20 grid as the board
var grid = [];

//Block shapes
var shapes = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  J: [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  L: [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  O: [[4, 4], [4, 4]],
  S: [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  T: [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
  Z: [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
};
const WIDTH = 10;
const HEIGHT = 20

var gridMini = [];
//Block colors
//var colors = ["F92338", "C973FF", "1C76BC", "FEE356", "53D504", "36E0FF", "F8931D"];
var colors = [0x000000, 0x022054, 0x013e13, 0x783e04, 0x780407, 0x005846, 0x45013f, 0x5d6d7e, 0x0e6251, 0x7e5109, 0x04274d, 0x811d05, 0x058165];
//Used to help create a seeded generated random number for choosing shapes. makes results deterministic (reproducible) for debugging
var rndSeed = Math.floor(Math.random() * 1000) + 1;

//BLOCK SHAPES
//coordinates and shape parameter of current block we can update
var currentShape = { x: 0, y: 0, shape: undefined };
//store shape of upcoming block
var upcomingShape;
//stores shapes
var bag = [];
//index for shapes in the bag
var bagIndex = 0;

//GAME VALUES
//Game score
var score = 0;
//level
var level = 1;
// game speed
var speed = 500;
// boolean for changing game speed
var changeSpeed = false;
//for storing current state, we can load later
var saveState;
//stores current game state
var roundState;
//list of available game speeds
var speeds = [1000, 800, 700, 600, 500, 450, 400, 350, 300, 275, 250, 225, 200, 180, 170, 160, 150, 140, 130, 120, 110, 100, 100, 100, 100];
//inded in game speed array
var speedIndex = 0;

//pause flag
var isPaused = false;
//drawing game vs updating algorithms
var draw = true;

//game modes
var gameMode = 'a';
var startLevel = 1;
var startHeight = 0;

var blockKey = 'field0'
//default save values
var defaultValues = {
  highScoreA: 0,
  highScoreB: 0,
  music: false,
  sfx: false,
  blockSet: 0,
  cheat: false,
}
var gameSettings = {};
