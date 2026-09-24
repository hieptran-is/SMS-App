import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { setupSocket } from './config/socket.js';

const port = Number(process.env.PORT) || 5000;
const httpServer = http.createServer(app);

setupSocket(httpServer);

const startServer = async () => {
	await connectDB();
	httpServer.listen(port, '0.0.0.0', () => {
		console.log(`Server running on port ${port}`);
	});
};

startServer().catch((error) => {
	console.error(error.message);
	process.exit(1);
});
