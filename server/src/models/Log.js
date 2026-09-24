import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
	{
		action: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true }
);

export default mongoose.model('Log', logSchema);
