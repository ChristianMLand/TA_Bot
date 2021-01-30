const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/tabot", {
    useNewUrlParser: true,
    useFindAndModify: false,
	useUnifiedTopology: true,
})
.then(() => console.log("Established a connection to the database"))
.catch(err => console.log("Something went wrong when connecting to the database", err));