const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const TodoTask = require("./models/TodoTask");
const app = express();

//with the help of static we can directly use it in url

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// for making the view as dynamic like first perform all the operations and then send

app.set("view engine", "ejs");



const DB = "mongodb://localhost:27017";


// ========== For connection to database ==========

async function mongoConnect() {
    await mongoose.connect(DB).then(() => {
        console.log(`connection successful`);
    }).catch((err) => {
        console.log(err);
    });
}

mongoConnect();

// ==========  for Get Method  ==========

app.get("/", async (req, res) => {
    const tasks = await TodoTask.find({});
    console.log()
    res.render("todo.ejs", { todoTasks: tasks });
});

// ==========  for Post Method  ==========

app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// ==========  for Update Method  ==========

app
    .route("/edit/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        const tasks = await TodoTask.find({});
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    })
    .post(async (req, res) => {
        const id = req.params.id;     // for getting the id by user
        const todoTask = await TodoTask.findByIdAndUpdate(id, { content: req.body.content }); // for search the id in database and update it
        try {
            await todoTask.save();
            res.redirect("/");
        } catch (err) {
            res.redirect("/");
        }
    });


// ==========  for Update Method  ==========

app.get("/remove/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndRemove(id);
        res.redirect("/");
    } catch (err) {
        res.send(err);
    }
});

app.listen(3000, () => console.log("Server Up and running"));