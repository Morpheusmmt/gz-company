import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.error !== 'Senha incorreta.') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

// Métodos de autenticação e gerenciamento de usuário
api.auth = {
  async login(email, senha) {
    try {
      const response = await api.post('/api/login', { email, senha });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Credenciais inválidas';
    }
  },

  // limpa dados e redireciona
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common["Authorization"];
    window.location.href = '/login';
  },

  // Pega o token atual
  getToken() {
    return localStorage.getItem('token');
  },

  // Verifica se está autenticado
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  },

  // Decodifica o token JWT 
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Erro ao parsear usuário:', e);
        return null;
      }
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default api;