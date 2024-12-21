import { Server } from "./server";

const server = new Server().getHttpServer(); // Retrieve HTTP server instance
let port =5000;
server.listen(port,()=>{
    console.log('we are runnning');
})