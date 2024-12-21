
import * as http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import bodyParser = require('body-parser');
import * as express from 'express';
import mongoose from 'mongoose';
import { getEnvironmentVariable } from './environment/environment';
import UserRouter from './routers/UserRouter';
import * as cors from 'cors';
import AdminRouter from './routers/AdminRouter';
import * as jwt from 'jsonwebtoken';
import Chat from './models/Chat';
import Redis from 'ioredis'; // Import Redis client


export class Server {
    public app: express.Application = express();
    private httpServer: http.Server; // HTTP server
    private io: SocketIOServer; // Socket.IO server
    corsOptions: cors.CorsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: '*',
        preflightContinue: false
    };
    constructor() {
        this.httpServer = http.createServer(this.app); // Bind HTTP server
        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
                credentials: true,
                methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
                origin: '*',
                preflightContinue: false
            }
        });
        // this.redisClient = new Redis({ host: 'localhost', port: 6379 });
        this.redisClient = {};

        this.setConfiguration();
        this.setRoutes();
        this.configureSocketIO(); // Set up Socket.IO
    }

    setConfiguration() {
        this.connectMongodb();
    }

    connectMongodb() {
        const databaseUrl = getEnvironmentVariable().db_url;
        mongoose.connect(databaseUrl)
            .then(() => console.log('Connected to database'))
            .catch((err) => console.error('Database connection failed:', err));
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use('*', cors(this.corsOptions));
    }
    // redisClient: Redis; // Store users' socket IDs by their email or ID
    redisClient:any={}
    setRoutes(){
        this.app.use('/api/user',UserRouter)
        this.app.use('/api/admin',AdminRouter)
        this.app.get("/api/chathistory",async (req,res)=>{
            const { user1, user2 } = req.query;

            try {
                const chats = await Chat.find({
                    $or: [
                        { from: user1, to: user2 },
                        { from: user2, to: user1 }
                    ]
                }).sort({ timestamp: 1 }); // Sort by oldest first

                res.json(chats);
            } catch (err) {
                console.error('Error fetching chat history:', err);
                res.status(500).json({ message: 'Server error' });
            }
        })
    }
    
    configureSocketIO() {
        // Socket.IO Middleware for Authentication
        this.io.use((socket, next) => {
            const token = socket.handshake.auth?.token;
            if (token) {
                jwt.verify(token, 'secret', (err, decoded) => {
                    if (err) {
                        console.log('Socket authentication failed:', err.message);
                        return next(new Error('Authentication error'));
                    }
                    socket.data.user = decoded; // Attach user data to socket
                    next();
                });
            } else {
                next(new Error('Token missing'));
            }
        });

        // Handle Socket.IO Events
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.data.user?.email || 'Anonymous'} with socketid ${socket.id}`);

            socket.on('register', async (userEmail) => {
                // await this.redisClient.set(`${userEmail}`, socket.id);
                this.redisClient[userEmail]=socket.id
                console.log('User registered with Redis:', userEmail);
            });
            // Listen for messages                 this.users[socket.data.user?.email] = socket.id;
            socket.on('private_message',async (data) => {
                const { to, content } = data;

                const chatMessage:any = new Chat({
                    from: socket.data.user.email,
                    to,
                    content,
                });
                await chatMessage.save();

                // const recipientSocketId = await this.redisClient.get(`${to}`);
                const recipientSocketId= this.redisClient[to];
                if (recipientSocketId) {
                    this.io.to(recipientSocketId).emit('private_message', {
                        from: socket.data.user.email,
                        content: content,
                    });
                    console.log(`Private message from ${socket.data.user.email} to ${to}: ${content}`);
                }
            });
            // Disconnect Event
            socket.on('disconnect', async () => {
                console.log('User disconnected:', socket.data.user.email);
                const email = socket.data.user?.email;
                if (email) {
                    // await this.redisClient.del(`${email}`);
                    delete this.redisClient[email]
                    console.log(`User disconnected and removed from Redis: ${email}`);
                }
            });
        });
    }

    // Expose the HTTP server instance
    getHttpServer() {
        return this.httpServer;
    }


    error404Handler(){
        this.app.use((req,res)=>{
            res.status(404).json({
                message: "not found",
                status_code : "404"
            })
        })
    }
    handleErrors(){
        this.app.use((error,req,res,next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'something went wrong',
                status_code : errorStatus
            })
        }) 
    }

    
}