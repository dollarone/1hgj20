var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {

    this.player;
    this.platforms;
    this.cursors;

    this.stars;
    this.score = 0;
    this.scoreText;

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    this.ground = this.platforms.create(20, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this.ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    this.ground.body.immovable = true;

    //  Now let's create two ledges
    this.ledge = this.platforms.create(400, 400, 'ground');
    this.ledge.body.immovable = true;

    this.ledge = this.platforms.create(-150, 350, 'ground');
    this.ledge.body.immovable = true;

    // The player and its settings
    this.player = this.game.add.sprite(132, this.game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.02;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = false;
    this.player.anchor.setTo(0.5);
    this.player.scale.x *= -1; // we only run right
    this.player.animations.add('run', [12,13,14,15,0,1,2,3,4,5,6,7,8,9,10,11], 10, true);

    //  Finally some stars to collect
    this.stars = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;


    //  The score
    this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.camera.follow(this.player);
    this.playerSpeed = 0;
    this.player.animations.play('run');
    this.scrollSpeed = 3;

    this.button = this.game.add.button(300, 100, 'button', this.actionOnClick, this, 0, 0, 1, 0);
    //this.button.fixedToCamera = true;
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(this.playerOut, this);
    this.gameOver = false;
  },

  update: function() {
    if (!this.gameOver) {
        this.score += 1;
    }
    this.scoreText.text = 'score: ' + this.score;

    //this.scrollPosition += this.playerSpeed;
    //this.ground.x -= this.scrollSpeed;
    this.platforms.x -= this.scrollSpeed;

    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.stars, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = this.playerSpeed;

    this.createRandomTerrain();

  },

  collectStar : function(player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;

  },

  actionOnClick : function(player) {
    if (this.player.body.touching.down) {
        this.player.body.velocity.y = -350;
    }
  },

  createRandomTerrain : function() {
    if (this.game.rnd.integerInRange(1, 40) == 1) {
    this.ledge = this.platforms.create(500 + this.score*3 + this.game.rnd.integerInRange(1, 200), 4 + this.game.rnd.integerInRange(1, 620), 'ground');
    this.ledge.body.immovable = true;

    }
  },

  playerOut : function() {
    this.scrollSpeed = 0;
    this.gameOver = true;
  }
};