import { Server } from 'socket.io';

let io;

export const setupSocket = (httpServer) => {
	io = new Server(httpServer, {
		cors: {
			origin: true,
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		socket.on('join-user', (userId) => {
			if (userId) socket.join(`user:${userId}`);
		});

		socket.on('join-conversation', (conversationId) => {
			if (conversationId) socket.join(`conversation:${conversationId}`);
		});
	});

	return io;
};

export const emitToConversation = (conversationId, event, payload) => {
	if (io && conversationId) io.to(`conversation:${conversationId}`).emit(event, payload);
};

export const emitToUser = (userId, event, payload) => {
	if (io && userId) io.to(`user:${userId}`).emit(event, payload);
};
