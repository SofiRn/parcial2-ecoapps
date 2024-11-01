const { gameEvents } = require("./gameEvents")
const { restartGameHandler } = require('../event-handlers/gameHandlers');

const handleEvents = (socket, io) => {
  gameEvents(socket, io)
}



module.exports = { handleEvents }
