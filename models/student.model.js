const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: String,
    comment: String,
    discord_id: String,
    cohort: String
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;