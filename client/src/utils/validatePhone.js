export const validatePhone = (phone) => /^(0|\+84)\d{8,10}$/.test(phone.trim());
