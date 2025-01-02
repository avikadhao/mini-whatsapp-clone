const mongoose = require("mongoose");
const Chat = require("C:/MONGO/models/chat.js");

main().then(() => {
    console.log("connection successful");
    initializeData();
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

async function initializeData() {
    let allChats = [
        {
            from: "neha",
            to: "priya",
            msg: "send me your exam sheets",
            created_at: new Date()
        },
        {
            from: "avi",
            to: "gautam",
            msg: "Hello gautam what are you doing !!",
            created_at: new Date()
        },
        {
            from: "dhruv",
            to: "aryan",
            msg: "All the best bhai",
            created_at: new Date()
        },
    ];

    try {
        await Chat.insertMany(allChats);
        console.log("Data initialization successful");
    } catch (err) {
        console.log(err);
    }
}
