import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { analyzeMessage } from '../ai/analyzeService.js';
import { emitToConversation, emitToUser } from '../config/socket.js';

const getConversationForUsers = async (firstUserId, secondUserId) => {
	let conversation = await Conversation.findOne({
		participants: { $all: [firstUserId, secondUserId], $size: 2 },
	});

	if (!conversation) {
		conversation = await Conversation.create({ participants: [firstUserId, secondUserId] });
	}

	return conversation;
};

export const listConversations = async (request, response, next) => {
	try {
		const conversations = await Conversation.find({ participants: request.user.id })
			.populate('participants', 'name phone avatar isOnline lastSeen')
			.populate({ path: 'lastMessage', populate: { path: 'sender', select: 'name' } })
			.sort({ updatedAt: -1 });

		response.json({ conversations });
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (request, response, next) => {
	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [request.user.id, request.params.userId], $size: 2 },
		});

		if (!conversation) return response.json({ conversation: null, messages: [] });

		const messages = await Message.find({ conversation: conversation.id })
			.populate('sender', 'name phone avatar')
			.sort({ createdAt: 1 });
		response.json({ conversation, messages });
	} catch (error) {
		next(error);
	}
};

export const sendMessage = async (request, response, next) => {
	try {
		const { text } = request.body;
		if (!text?.trim()) return response.status(400).json({ message: 'Tin nhắn không được để trống' });

		const conversation = await getConversationForUsers(request.user.id, request.params.userId);
		const analysis = await analyzeMessage(text.trim());
		const message = await Message.create({
			conversation: conversation.id,
			sender: request.user.id,
			text: text.trim(),
			analysis,
		});

		conversation.lastMessage = message.id;
		await conversation.save();
		const populatedMessage = await Message.findById(message.id).populate('sender', 'name phone avatar');
		const payload = { conversationId: conversation.id, message: populatedMessage };

		emitToConversation(conversation.id, 'message-received', payload);
		emitToUser(request.params.userId, 'conversation-updated', payload);
		emitToUser(request.params.userId, 'message-received', payload);
		response.status(201).json(payload);
	} catch (error) {
		next(error);
	}
};
