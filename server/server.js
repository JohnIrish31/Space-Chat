const express = require("express");
const app = express();
const UserRoute = require("./routes/UserRoute")
const User = require("./models/User")
const Message = require("./models/Message")

const groupChat = ["Work Mates", "Friends", "Family", "Gym Buddies"];

const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", UserRoute);
require("./Fetching")

const server = require("http").createServer(app);
const PORT = process.env.PORT || 4001;
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


async function getMessageHistory(room) {
    let roomMessages = await Message.aggregate([
        { $match: { to: room } },
        {$group: {_id: "$date", messagesByDate: {$push: "$$ROOT"}}}
    ])
    return roomMessages;
}

function sortGroupMessagesByDate(messages) {
    return messages.sort(function (a,b) {
        let date1 = a._id.split("/");
        let date2 = b._id.split("/");

        date1 = date1[2] + date1[0] + date1[1]
        date2 = date2[2] + date2[0] + date2[1];

        return date1 < date2 ? -1 : 1
    })
}

io.on("connection", (socket) => {

    socket.on("new-user", async () => {
        const buddy = await User.find();
        io.emit("new-user", buddy)
    })

    socket.on("join-room", async (newRoom, previousRoom) => {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMessages = await getMessageHistory(newRoom);
        roomMessages = sortGroupMessagesByDate(roomMessages);
        socket.emit("room-messages", roomMessages)
    })

    socket.on("message-room", async (room, content, sender, time, date) => {
        console.log("new message", content)
        const newMessage = await Message.create({ content, from: sender, time, date, to: room });
        let roomMessages = await getMessageHistory(room);
        roomMessages = sortGroupMessagesByDate(roomMessages);

        io.to(room).emit("room-messages", roomMessages);

        socket.broadcast.emit("notifications", room)
    })

    app.delete('/logout', async(req, res)=> {
    try {
      const {_id, newMessages} = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const buddy = await User.find();
      socket.broadcast.emit('new-user', buddy);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send()
    }
  })

})



app.get("/groupChat", (req, res) => {
    res.json(groupChat)
});


server.listen(PORT, () => {
    console.log("Connected to port", PORT)
});