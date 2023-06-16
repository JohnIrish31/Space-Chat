const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@zuitt-bootcamp.4alz3ct.mongodb.net/spaceChat?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once("open", () => console.log("Now Connected to MongoDb"))
