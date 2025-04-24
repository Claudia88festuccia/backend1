// import express from "express";
// // import "dotenv/config"
// import dotenv from 'dotenv';
// import cors from "cors";
// import authorsRouter from "./routes/authors.js";
// import postsRouter from "./routes/posts.js";
// import connectDB from "./db.js";

// // import mongoose from "mongoose";

// dotenv.config();

// const app = express();

// const corsOptions = {
//     origin: 'http://localhost:3000',  // Cambia con l'URL del tuo frontend
//     methods: 'GET, POST, PUT, DELETE',
// };
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.originalUrl}`);
//     next();
//   });

//   app.use(express.json());
// app.use(cors(corsOptions));
// app.use(cors());



// app.use("/authors", authorsRouter);
// app.use("/posts", postsRouter);


// app.get("/", (req, res) => {
//     res.send("Hello World!");
// })

// connectDB();

// // app.post("/", (req, res) => {
// //     res.send(req.body);
// // console.log(req.body);
// // })
// // const connetDB= async () => {
// //     try {
// //         await mongoose.connect(process.env.MONGO_URI);

// //         console.log("Connected to MongoDB");
// //     } catch (error) {
// //         console.log(error);
// //     }
// // }
// // connetDB();

// app.listen(process.env.PORT || 3001, () => {
//     console.log('Server in esecuzione sulla porta ' + (process.env.PORT || 3001));
//   });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authorsRouter from "./routes/authors.js";
import postsRouter from "./routes/posts.js";
import connectDB from "./db.js";

dotenv.config();

const app = express();
app.use((req, res, next) => {
    console.log("CORS middleware attivato per: " + req.originalUrl); // Log quando il middleware CORS viene eseguito
    next();
});

const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE"
};

app.use(express.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});


app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/posts", (req, res) => {
    console.log("Ricevuta richiesta POST su /posts");
    res.send("Test POST riuscito");
});




connectDB();

app.listen(process.env.PORT || 3001, () => {
    console.log("Server in esecuzione sulla porta " + (process.env.PORT || 3001));
});
