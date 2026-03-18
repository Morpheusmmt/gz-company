
const validators = {
  // Valida e-mail
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Valida telefone 
  isValidPhone: (phone) => {
    const phoneRegex = /^[\d\s\-\(\)\+]{8,20}$/;
    return phoneRegex.test(phone);
  },

  sanitizeString: (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  },

  // Valida tamanho mínimo de texto
  isValidLength: (text, minLength = 50) => {
    return text && text.trim().length >= minLength;
  },

  isNotEmpty: (str) => {
    return str && str.trim().length > 0;
  }
};

module.exports = { validators };