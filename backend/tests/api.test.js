/**
 * Testes Automatizados da API - GZ Company
 * Testes de integração para endpoints REST
 */

const http = require('http');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

/**
 * Utilitário para fazer requisições HTTP
 */
const makeRequest = (method, path, data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
};

/**
 * Framework de testes simples
 */
let testsPassed = 0;
let testsFailed = 0;
const testResults = [];

const test = async (name, fn) => {
  try {
    await fn();
    testsPassed++;
    testResults.push({ name, status: 'PASSED', error: null });
    console.log(`✅ ${name}`);
  } catch (error) {
    testsFailed++;
    testResults.push({ name, status: 'FAILED', error: error.message });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

const assertEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
};

/**
 * Testes da API
 */
const runTests = async () => {
  console.log('\n🧪 Iniciando Testes da API - GZ Company\n');
  console.log('═'.repeat(50));

  // Teste 1: Health Check
  await test('GET / - Health Check', async () => {
    const response = await makeRequest('GET', '/');
    assertEqual(response.status, 200, 'Status should be 200');
  });

  // Teste 2: Swagger Docs disponível
  await test('GET /api-docs - Swagger Documentation', async () => {
    const response = await makeRequest('GET', '/api-docs/');
    assert(response.status === 200 || response.status === 301, 'Swagger should be accessible');
  });

  // Teste 3: Login com credenciais inválidas
  await test('POST /login - Invalid credentials', async () => {
    const response = await makeRequest('POST', '/login', {
      email: 'invalid@test.com',
      senha: 'wrongpassword'
    });
    assert(response.status === 401 || response.status === 400, 'Should reject invalid credentials');
  });

  // Teste 4: Registro sem dados
  await test('POST /register - Missing required fields', async () => {
    const response = await makeRequest('POST', '/register', {});
    assert(response.status === 400 || response.status === 422, 'Should reject missing fields');
  });

  // Teste 5: Acesso a rota protegida sem token
  await test('GET /users - Unauthorized without token', async () => {
    const response = await makeRequest('GET', '/users');
    assertEqual(response.status, 401, 'Should require authentication');
  });

  // Teste 6: Consultorias - Lista pública
  await test('GET /api/consultorias - List consultorias', async () => {
    const response = await makeRequest('GET', '/api/consultorias');
    assert(response.status === 200 || response.status === 401, 'Should return list or require auth');
  });

  // Teste 7: Projetos - Acesso
  await test('GET /api/projetos - Access projects', async () => {
    const response = await makeRequest('GET', '/api/projetos');
    assert(response.status === 200 || response.status === 401, 'Should return list or require auth');
  });

  // Teste 8: Roles - Requer autenticação
  await test('GET /roles - Requires authentication', async () => {
    const response = await makeRequest('GET', '/roles');
    assertEqual(response.status, 401, 'Should require authentication');
  });

  // Teste 9: Rota inexistente
  await test('GET /nonexistent - 404 Not Found', async () => {
    const response = await makeRequest('GET', '/rota-que-nao-existe-12345');
    assertEqual(response.status, 404, 'Should return 404');
  });

  // Teste 10: Validação de email no registro
  await test('POST /register - Invalid email format', async () => {
    const response = await makeRequest('POST', '/register', {
      nome: 'Test User',
      email: 'invalid-email',
      senha: '123456'
    });
    assert(response.status === 400 || response.status === 422, 'Should reject invalid email');
  });

  // Resumo
  console.log('\n' + '═'.repeat(50));
  console.log(`\n📊 Resumo dos Testes:`);
  console.log(`   ✅ Passou: ${testsPassed}`);
  console.log(`   ❌ Falhou: ${testsFailed}`);
  console.log(`   📋 Total:  ${testsPassed + testsFailed}`);
  console.log(`   📈 Taxa:   ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%\n`);

  // Saída com código apropriado
  process.exit(testsFailed > 0 ? 1 : 0);
};

// Executar testes
runTests().catch(error => {
  console.error('Erro ao executar testes:', error);
  process.exit(1);
});
