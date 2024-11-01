// gameHandlers.js

const { assignRoles } = require('../utils/helpers');

// Assuming db and io are required or passed in some way to be accessible
const joinGameHandler = (socket, db, io) => {
	return (user) => {
		db.players.push({ id: socket.id, ...user });
		console.log(db.players);
		io.emit('userJoined', db); // Broadcasts the message to all connected clients including the sender
	};
};

const startGameHandler = (socket, db, io) => {
	return () => {
		// Preserve existing points
		const existingScore = db.players.reduce((acc, player) => {
			acc[player.id] = player.score;
			return acc;
		}, {});

		// Reassign roles but keep points
		db.players = assignRoles(db.players).map((player) => ({
			...player,
			score: existingScore[player.id] || 0,
		}));

		db.players.forEach((element) => {
			io.to(element.id).emit("startGame", element.role);
		});
	};
};

// const startGameHandler = (socket, db, io) => {
//   return () => {
//     db.players = assignRoles(db.players)

//     db.players.forEach((element) => {
//       io.to(element.id).emit("startGame", element.role)
//     })
//   }
// }

const notifyMarcoHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === "polo" || user.role === "polo-especial");

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit("notification", {
				message: "Marco!!!",
				userId: socket.id,
			});
		});
	};
};

const notifyPoloHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === "marco");

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit("notification", {
				message: "Polo!!",
				userId: socket.id,
			});
		});
	};
};

const restartGameHandler = (socket, db, io) => {
	return () => {
		// Restablecer la puntuación de cada jugador a 0
		db.players = db.players.map((player) => ({
			...player,
			score: 0,
		}));

		// Emitir la nueva lista de jugadores a todos los clientes
		io.emit('userJoined', { players: db.players });
	};
};

const onSelectPoloHandler = (socket, db, io) => {
	return (userID) => {
		const myUser = db.players.find((user) => user.id === socket.id);
		const poloSelected = db.players.find((user) => user.id === userID);
		const poloEspecial = db.players.find((user) => user.role === "polo-especial");

		let message = '';
		let declareWinner = null;

		if (poloSelected.role === "polo-especial") {
			myUser.score += 50;
			poloSelected.score -= 10;
			message = `Marco ${myUser.nickname} atrapo a polo especial ${poloSelected.nickname}. Marco +50 puntos y Polo Especial -10 puntos.`;
		} else if (poloSelected.role === "polo") {
			myUser.score -= 10;
			poloEspecial.score += 10;
			message = `Marco ${myUser.nickname} NO atrapo a polo especial. Marco -10 puntos y Polo Especial +10 puntos.`;
		}

		const players = [myUser, poloSelected, poloEspecial];
		winner = players.find((player) => player.score >= 100);

		if (winner) {
			message = `¡Felicidades ${winner.nickname} ganaste el juego con ${winner.score} puntos!`;
		}

		io.emit("notifyGameOver", {
			message: message,
			updatedPlayers: db.players,
			winner: winner,
		});
	};
};

module.exports = {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
  restartGameHandler,
};
