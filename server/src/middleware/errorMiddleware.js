export const notFound = (request, response) => {
	response.status(404).json({ message: `Không tìm thấy ${request.originalUrl}` });
};

export const errorHandler = (error, _request, response, _next) => {
	console.error(error);
	response.status(error.statusCode || 500).json({
		message: error.message || 'Đã xảy ra lỗi máy chủ',
	});
};
