import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, maxlength: 80 },
		phone: { type: String, required: true, unique: true, trim: true, index: true },
		password: { type: String, required: true, select: false },
		avatar: { type: String, default: '' },
		isOnline: { type: Boolean, default: false },
		lastSeen: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

userSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		delete returnedObject.password;
		delete returnedObject.__v;
		return returnedObject;
	},
});

export default mongoose.model('User', userSchema);
