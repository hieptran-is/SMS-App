const suspiciousPatterns = [
	{ pattern: /chuyển khoản|chuyển tiền/i, reason: 'Yêu cầu chuyển tiền' },
	{ pattern: /mật khẩu|otp|mã xác thực/i, reason: 'Đề cập đến thông tin bảo mật' },
	{ pattern: /trúng thưởng|quà tặng|nhận thưởng/i, reason: 'Có dấu hiệu mời nhận thưởng' },
	{ pattern: /http:\/\/|https:\/\//i, reason: 'Có chứa liên kết' },
];

export const inspectMessage = (text) => {
	const reasons = suspiciousPatterns
		.filter(({ pattern }) => pattern.test(text))
		.map(({ reason }) => reason);

	return {
		isSuspicious: reasons.length >= 2,
		score: Math.min(reasons.length * 25, 100),
		reasons,
	};
};
