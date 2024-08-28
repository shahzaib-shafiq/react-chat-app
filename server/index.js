const express = require("express");
const app = express();
const PORT = 4000;
require("dotenv").config();
// New imports
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const { connectToDatabase } = require("./config/db");
const User = require("./config/userModel");

const dbConnect = async () => {
  try {
    await connectToDatabase();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
};

dbConnect();

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

socketIO.on("connection", async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  //const addUser = await User.create({ Socket_id: socket.id });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("message", (data) => {
    console.log(data);
    socketIO.emit("messageResponse", data);
  });

  socket.on("newUser", async (data) => {
    if (users.length >= 2) {
      // Notify the client that the limit has been reached
      socket.emit("two users allowed", {
        message: "Only two users can be added",
      });
      return;
    }

    users.push(data);
    console.log(users);

    socketIO.emit("newUserResponse", users);

    try {
      for (const user of users) {
        await User.create({
          user_name: user.userName,
          Socket_id: user.socketID,
        });
      }
      console.log("All users have been stored successfully.");
    } catch (error) {
      console.error("Error storing users:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");

    // Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);

    // Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// const express = require("express");
// const app = express();
// const PORT = 4000;

// //New imports
// const http = require("http").Server(app);
// const cors = require("cors");

// app.use(cors());

// const socketIO = require("socket.io")(http, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// //Add this before the app.get() block
// // socketIO.on("connection", (socket) => {
// //   console.log(`⚡: ${socket.id} user just connected!`);
// //   socket.on("disconnect", () => {
// //     console.log("🔥: A user disconnected");
// //   });
// // });
// let users = [];

// socketIO.on("connection", (socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);
//   socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

//   socket.on("message", (data) => {
//     console.log(data);
//   });

//   socket.on("message", (data) => {
//     socketIO.emit("messageResponse", data);
//   });

//   socket.on("newUser", (data) => {
//     //Adds the new user to the list of users
//     users.push(data);
//     // console.log(users);
//     //Sends the list of users to the client
//     socketIO.emit("newUserResponse", users);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔥: A user disconnected");
//     //Updates the list of users when a user disconnects from the server
//     users = users.filter((user) => user.socketID !== socket.id);
//     // console.log(users);
//     //Sends the list of users to the client
//     socketIO.emit("newUserResponse", users);
//     socket.disconnect();
//   });
// });

// app.get("/api", (req, res) => {
//   res.json({
//     message: "Hello world",
//   });
// });

// http.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });
