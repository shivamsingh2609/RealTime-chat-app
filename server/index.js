import express from "express"
import dotenv from "dotenv"
import cors from 'cors';
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./route/AuthRoute.js";
import contactsRoutes from "./route/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./route/MessagesRoutes.js";
import channelRoutes from "./route/ChannelRoutes.js";
dotenv.config();
const app = express();
const databaseURL = process.env.DATABASE_URL;
const port = process.env.PORT || 3001;
app.use(cors({
   origin: [process.env.ORIGIN],
   methods:["GET","POST","PUT","PATCH","DELETE"],
   credentials:true
}))
app.use('/uploads/profiles',express.static("uploads/profiles"));
app.use("/uploads/files",express.static("uploads/files"))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/contacts" , contactsRoutes);
app.use("/api/messages",messagesRoutes)
app.use("/api/channel" , channelRoutes)
const server = app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
});
setupSocket(server)
mongoose.connect(databaseURL).then(()=> console.log("DB Connection Successfull"));

