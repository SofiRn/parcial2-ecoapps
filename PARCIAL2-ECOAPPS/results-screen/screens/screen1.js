import { router, socket } from '../routes.js';

export default function renderScreen1() {
	const app = document.getElementById('app');

	app.innerHTML = `
  <div id="score-screen">
  <h1>Puntuaciones</h1>

  <ul id="scores-list"></ul>

  <button id="alphabeticalOrderButton">Ordenar alfabéticamente</button>
		</div>

  <div id="declareWinner"></div>
 <button id="restart-button" style="display: none;">Volver a jugar</button>


	`;

	let players = [];

	socket.on('userJoined', (data) => {
		console.log('New user joined:', data);
		players = data.players; // actualizar la lista de jugadores con todos los jugadores actuales
		renderPlayersList(players);
	});

	socket.on('notifyGameOver', (data) => {
		console.log('Received notifyGameOver event:', data);
		players = data.updatedPlayers;
		const declareWinner = document.getElementById('declareWinner');
		const restartButton = document.getElementById('restart-button');

		const winner = players.find((player) => player.score >= 100);
		if (winner) {
			declareWinner.innerHTML = `<div class="winner-message">¡Felicidades ${winner.nickname} ganaste la partida con ${winner.score} puntos!</div>`;
			restartButton.style.display = 'block'; // Mostrar el botón de reinicio
		} else {
			restartButton.style.display = 'none'; // Ocultar el botón de reinicio si no hay ganador
		}

		renderPlayersList(players);
	});

	document.getElementById('alphabeticalOrderButton').addEventListener('click', () => {
		players.sort((a, b) => a.nickname.localeCompare(b.nickname));
		renderPlayersList(players);
	});

  document.getElementById('restart-button').addEventListener('click', () => {
    socket.emit('restartGame'); // Emitir el evento para reiniciar el juego
  });
}




function renderPlayersList(players) {
	const scoresList = document.getElementById('scores-list');
	scoresList.innerHTML = '';

	players.forEach((player) => {
		const scoreItem = document.createElement('li');
		scoreItem.textContent = `${player.nickname}: ${player.score} points`;
		scoresList.appendChild(scoreItem);
	});

	// document.getElementById('restart-button').addEventListener('click', () => {
	// 	winnerDeclared = false;
	// 	players = {};

	// 	renderScoreList();
	// 	socket.emit('restartGame');
	// });
}
// let players = [];

// export default function renderScreen1() {
// 	const scoreScreen = document.getElementById('score-screen');
// 	const winnerScreen = document.getElementById('winner-screen');
// 	const scoreList = document.getElementById('score-list');
// 	const winnerMessage = document.getElementById('winner-message');
// 	const restartButton = document.getElementById('restart-button');
// 	const alphabeticalOrderButton = document.getElementById('alphabetical-order-button');
// 	const finalScoreList = document.getElementById('final-score-list');

// 	scoreScreen.style.display = 'flex';
// 	winnerScreen.style.display = 'none';

// 	socket.on('notifyGameOver', (data) => {
// 		console.log('Received notifyGameOver event:', data);
// 		players = data.updatedPlayers;
// 		// const winnerAnnouncement = document.getElementById('winner-announcement');

// 		// const winner = players.find((player) => player.points >= 100);
// 		// if (winner) {
// 		// 	winnerAnnouncement.innerHTML = `
// 		// 		<div class="winner-message">
// 		// 			¡Felicidades ${winner.nickname}!
// 		// 			🎉 ¡Has ganado el juego! 🏆
// 		// 		</div>
// 		// 	`;
// 		//  }

// 		renderPlayersList();
// 	});

// 	alphabeticalOrderButton.addEventListener('click', () => {
// 		const sortedPlayers = Object.values(players).sort((a, b) => a.nickname.localeCompare(b.nickname));
// 		scoresList.innerHTML = '';
// 		sortedPlayers.forEach((player) => {
// 			const li = document.createElement('li');
// 			li.innerText = `${player.nickname}: ${player.score ?? 0} pts`;
// 			scoresList.appendChild(li);
// 		});
// 	});

// 	// document.getElementById('sortAlpha').addEventListener('click', () => {
// 	// 	players.sort((a, b) => a.nickname.localeCompare(b.nickname));
// 	// 	renderPlayersList(players);
// 	// });

// 	// document.getElementById('sortScore').addEventListener('click', () => {
// 	// 	players.sort((a, b) => b.points - a.points);
// 	// 	renderPlayersList(players);
// 	// });

// 	function renderPlayersList(players) {
// 		const scoresList = document.getElementById('scores-list');
// 		scoresList.innerHTML = '';

// 		players.forEach((player) => {
// 			const scoreItem = document.createElement('li');
// 			scoreItem.textContent = `${player.nickname}: ${player.score} points`;
// 			scoresList.appendChild(scoreItem);
// 		});
// 	}

// 	socket.on('declareWinner', (data) => {
// 		declareWinner(data.winner, data.players);
// 	});

// 	function declareWinner(winningPlayer, finalPlayers) {
// 		winnerDeclared = true;
// 		winnerScreen.style.display = 'flex';
// 		scoreScreen.style.display = 'none';
// 		winnerMessage.innerText = `¡Felicidades ${winningPlayer.nickname}, ganaste con ${winningPlayer.score ?? 0} puntos!`;

// 		// finalScoreList.innerHTML = '';
// 		// finalPlayers
// 		//   .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
// 		//   .forEach((player, index) => {
// 		//     const li = document.createElement('li');
// 		//     li.innerText = `${index + 1}. ${player.nickname} (${player.score ?? 0} pts)`;
// 		//     finalScoreList.appendChild(li);
// 		//   });
// 	}

// 	restartButton.addEventListener('click', () => {
// 		winnerDeclared = false;
// 		players = {};
// 		winnerScreen.style.display = 'none';
// 		scoreScreen.style.display = 'block';
// 		renderScoresList();
// 		socket.emit('restartGame');
// 	});
// }

// // export default function renderScreen1() {
// //   const app = document.getElementById("app");
// //   app.innerHTML = `
// //         <h1>Screen 1</h1>
// //         <p>This is the Screen 1</p>
// //     `;

// //   socket.on("eventListenerExample", (data) => {});
// // }
