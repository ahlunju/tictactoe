var Game = function(el){
	this.board = $(el + '> div');
	this.rowA = $(el).find('[id^=grid-ra]');
	this.rowB = $(el).find('[id^=grid-rb]');
	this.rowC = $(el).find('[id^=grid-rc]');
	this.col1 = $(el).find('[id$=c1]');
	this.col2 = $(el).find('[id$=c2]');
	this.col3 = $(el).find('[id$=c3]');
	this.diaA = $(el).find('.diaA'); //rac1 rbc2 rcc3
	this.diaB = $(el).find('.diaB'); //rac3 rbc2 rcc1
	this.move = 0;
	this.gameOver = false;
}

Game.prototype = {
	hasMehClass: function(el){
		return $(el).hasClass('meh');
	},

	hasSadClass: function(el){
		return $(el).hasClass('sad');
	},

	setCss: function(color){
		this.css('color', color);
	},

	hasSameClass: function(el, func){
		if (Array.prototype.every.call(el, func)){
			return el;
		}
	},

	checkPlayerState: function(func, color){
		if (Array.prototype.every.call(this.rowA, func)){
			this.rowA.css("color", color);
			return true;
		} else if (Array.prototype.every.call(this.rowB, func)){
			this.rowB.css("color", color);
			return true;
		} else if (Array.prototype.every.call(this.rowC, func)){
			this.rowC.css("color", color);
			return true;
		}
		else if (Array.prototype.every.call(this.col1, func)){
			this.col1.css("color", color);
			return true;
		}
		else if (Array.prototype.every.call(this.col2, func)){
			this.col2.css("color", color);
			return true;
		}
		else if (Array.prototype.every.call(this.col3,  func)){
			this.col3.css("color", color);
			return true;
		}
		else if (Array.prototype.every.call(this.diaA, func)){
			this.diaA.css("color", color);
			return true;
		}
		else if (Array.prototype.every.call(this.diaB, func)){
			this.diaB.css("color", color);
			return true;
		}
	}
}

var ticTacToe = new Game('#board');

// (function($, ticTacToe){

	$(ticTacToe.board).on('click', checkGameState);

		// var self = $(this); // grid 
		// if(!ticTacToe.gameOver){
		// 	if(!self.hasClass('clicked')){
		// 		self.addClass('clicked');
		// 		if( ticTacToe.move % 2 == 0){
		// 			self.addClass('meh').append('<i class="fa fa-meh-o fa-4x">');
		// 		} else {
		// 			self.addClass('sad').append('<i class="fa fa-frown-o fa-4x">');
		// 		}
		// 		ticTacToe.move += 1;
		// 		if (ticTacToe.checkPlayerState(ticTacToe.hasMehClass, '#bada55')){
		// 			console.log('Meh Player 1 won');
		// 			ticTacToe.gameOver = true;
		// 		} else if (ticTacToe.checkPlayerState(ticTacToe.hasSadClass, '#da55c4')){
		// 			console.log(':( You won');
		// 			ticTacToe.gameOver = true;
		// 		}
		// 	}
		// }
	function checkPlayerState(){
		if (ticTacToe.checkPlayerState(ticTacToe.hasMehClass, '#bada55')){
			console.log('Meh Player 1 won');
			ticTacToe.gameOver = true;
		} else if (ticTacToe.checkPlayerState(ticTacToe.hasSadClass, '#da55c4')){
			console.log(':( You won');
			ticTacToe.gameOver = true;
		}
	}

	function renderGrid(){
		var mehHTML = '<i class="fa fa-meh-o fa-4x">';
		var sadHTML = '<i class="fa fa-frown-o fa-4x">';
		if (ticTacToe.move % 2 == 0){
			this.addClass('meh')
				.append(mehHTML);
		} else {
			this.addClass('sad')
				.append(sadHTML);
		}
		ticTacToe.move += 1;
		checkPlayerState();
	}

	function isGridClicked(){
		if (!this.hasClass('clicked')){
			this.addClass('clicked');
			renderGrid.call(this);
		}
	}

	function checkGameState(){
		var self = $(this);
		if (!ticTacToe.gameOver) {
			console.log(ticTacToe.gameOver);
			isGridClicked.call(self);
		}
	}
	
// })(jQuery, ticTacToe);
