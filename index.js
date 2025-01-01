const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Chat = require("./models/chat"); // Corrected the path for the Chat model

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
        console.log("Connection successful");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}
main();

app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        console.log(chats);
        res.render("index.ejs", { chats });
    } catch (err) {
        console.error("Error fetching chats", err);
        res.status(500).send("Server Error");
    }
});

app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
    try {
        let { from, to, msg } = req.body;
        let newChat = new Chat({
            from,
            to,
            msg,
            created_at: new Date(),
        });
        await newChat.save();
        res.redirect("/chats");
    } catch (err) {
        console.error("Error creating new chat", err);
        res.status(500).send("Server Error");
    }
});

app.get("/chat/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", { chat });
    } catch (err) {
        console.error("Error fetching chat for edit", err);
        res.status(500).send("Server Error");
    }
});

app.put("/chat/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let { msg } = req.body;
        await Chat.findByIdAndUpdate(id, { 
            msg,
            created_at: new Date() // Update the created_at field
        });
        res.redirect("/chats");
    } catch (err) {
        console.error("Error updating chat", err);
        res.status(500).send("Server Error");
    }
});

// Define the requireLogin middleware
const requireLogin = (req, res, next) => {
    // Middleware logic here, for example, checking if the user is authenticated
    next();
};

app.delete("/chat/:id", requireLogin, async (req, res) => {
    try {
        let { id } = req.params;
        await Chat.findByIdAndDelete(id);
        res.redirect("/chats");
    } catch (err) {
        console.error("Error deleting chat", err);
        res.status(500).send("Server Error");
    }
});

app.get("/", (req, res) => {
    res.send("Root is working");
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
