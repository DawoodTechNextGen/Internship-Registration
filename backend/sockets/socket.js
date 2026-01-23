// const { io } = require("../app");
const { getRegistrationCount } = require("../controller/register.controller");

const setupSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    // initial count

    const count = await getRegistrationCount();
    socket.emit("registrationCount", { total: count });
  });
};

module.exports = setupSocket;
