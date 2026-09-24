export const formatTime = (date) => {
	if (!date) return '';
	return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
};

export const formatListTime = (date) => {
	if (!date) return '';
	const value = new Date(date);
	const today = new Date();
	if (value.toDateString() === today.toDateString()) return formatTime(date);
	return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(value);
};
