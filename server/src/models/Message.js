import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
	{
		conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		text: { type: String, required: true, trim: true, maxlength: 5000 },
		status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
		analysis: {
			isSuspicious: { type: Boolean, default: false },
			score: { type: Number, default: 0 },
			reasons: [{ type: String }],
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Message', messageSchema);
