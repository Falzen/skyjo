/* * * * * * * * * * * * * * * * * * * * * *
fonts: https://japanesefonts.org/
	* * * BACKLOG * * *
- 

	* * * TODO * * *
- 

* * * * * * * * * * * * * * * * * * * * * */

$(document).ready(function() {
	init();
});

function init() {
	setEventsListeners();
	makeGameCards(); // sets weightedCardList

	createDeckDom();

	// fill player grid with cards
	let drawnCards = drawCardsFromDeck(weightedCardList, spreadData.h*spreadData.w);
	makeSpreadDom(drawnCards);


}

/*
player turn: 
player can:
	reveal a card face down
	OR draw a card from the deck OR from the bin

if reveal: 
	-> end turn

if card drawn:
	- place it in the bin 
		-> end turn
	- replace any of own cards 
		-> end turn

*/

var engine = {
	isPlaying: true, // is player's turn
	hasRevealed: false, // has chosen to turn over own card
	hasDrawn: false, // has chosen to draw (from deck OR bin)
	hasPlayed: false, // is done with drawn card (replace or discard)
	isturnOver: false,
	drawnCardDom: null
}

function resetEngine() {
	engine.isPlaying = true;
	engine.hasRevealed = false;
	engine.hasDrawn = false;
	engine.hasPlayed = false;
	engine.isturnOver = false;
	engine.drawnCardDom = null;
}


function setEventsListeners() {
	$('body')
	// revealing own card OR replacing
	.on('click', '.card-container', function(ev) {
		if(!engine.isPlaying) { return; }

		// is revealing own card
		if(engine.hasDrawn == false) {
			console.log('is revealing');
			$(ev.currentTarget).addClass('is-turned');
			engine.hasRevealed = true;
			engine.isPlaying = false;
			doEndTurn()
			return;
		}

		// is replacing own card
		else if(engine.hasDrawn == true && engine.hasRevealed == false) {
			console.log('is replacing own card');
			console.log('ev.currentTarget : ', ev.currentTarget);
			// replace clicked card with (new) drawn card
			$(ev.currentTarget).parent().html(engine.drawnCardDom);
			// remove (old) drawn card from table
			$('#drawnCardContainer').html('');

			engine.isPlaying = false;
			doEndTurn()
		}
	})
	// draw deck
	.on('click', '#drawFromDeckBtn', function(ev) {
		if(!engine.isPlaying) { return; }
		let drawnCards = drawCardsFromDeck(weightedCardList, 1);
		if(drawnCards.length == 0) {
			alert('no more cards in the deck');
			return;
		}
		engine.drawnCardDom = makeCardDom(drawnCards[0], true);
		$('#drawnCardContainer').html(engine.drawnCardDom);
		console.log('engine.hasDrawn = true');
		engine.hasDrawn = true;
	})
	// draw bin
	.on('click', '#drawFromBinBtn', function(ev) {
		if(!engine.isPlaying) { return; }
		$(ev.currentTarget).addClass('is-turned');
	})





	.on('mousedown', 'a.link', function(ev) {
		
	}).on('mouseup', 'a.link', function(ev) {
		
	});
}


var spreadData = {
	h:3,
	w:4
}

function doEndTurn() {
	setTimeout(function() {
		showModal('end of turn');
	}, 400);
	// setTimeout(function() {
	// 	resetEngine();
	// 	hideModal()
	// }, 1400);
	setTimeout(function() {
		showModal('your turn');
	}, 800);
	setTimeout(function() {
		resetEngine();
		hideModal()
	}, 1300);
}

function makeSpreadDom(hiddenCards) {
	let domOutput = '';
	let cardCpt = 0;
	for (var i = 0; i < spreadData.h; i++) {
		domOutput += '<tr>';
		for (var j = 0; j < spreadData.w; j++) {
			let id = i+'_'+j;
			let cardDom = makeCardDom(hiddenCards[cardCpt], false);
			domOutput += '<td id="'+id+'"><div class="cell">' + cardDom + '</div> </td>';
			cardCpt++;
		}
		domOutput += '</tr>';
	}
	$('#spread').html(domOutput);
}


function showModal(text) {
	$('#modalText').text(text);
	$('.modal-part').show();
}

function hideModal() {
	$('#modalText').text('');
	$('.modal-part').hide();
}

var weightedCardList = [];

function makeGameCards() {
	let cardFreq = {
		"- 2" : 5,
		"- 1" : 10,
		"0" : 15,
		"+ 1" : 10,
		"+ 2" : 10,
		"+ 3" : 10,
		"+ 4" : 10,
		"+ 5" : 10,
		"+ 6" : 10,
		"+ 7" : 10,
		"+ 8" : 10,
		"+ 9" : 10,
		"+ 10" : 10,
		"+ 11" : 10,
		"+ 12" : 10
	}


	for (const [cardValue, qte] of Object.entries(cardFreq)) {
		for (var i = 0; i < qte; i++) {
			weightedCardList.push({'val': cardValue});
		}
	}
	console.log('deck size: ', weightedCardList.length);
	shuffleDeck(weightedCardList);
}


function createDeckDom() {
	// 
}

function makeCardDom(data, isFaceUp) {
	//let domOutput = '<div class="card" data-val="'+data.val+'"><p class="val">'+data.val+'</p></div>';
	let domOutput = `
	  	<div class="card-container ${isFaceUp ? 'is-turned' : ''}">
			<div class="card">
				<div class="front">
					<p class="val"></p>
				</div>
				<div class="back ${data.val[0] == '-' ? 'is-negative' : 'is-positive'}">
					<p class="val">${data.val}</p>
				</div>
			</div>
		</div>
  `;
	return domOutput;
}