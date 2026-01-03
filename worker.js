// Cloudflare Worker 加速代理
// 目标：加速访问 https://zf-eosin.vercel.app
export default {
  async fetch(request, env, ctx) {
    const TARGET = 'https://zf-eosin.vercel.app';
    
    // 构建目标 URL
    const url = new URL(request.url);
    const targetUrl = TARGET + url.pathname + url.search;
    
    console.log(`加速代理: ${url.href} -> ${targetUrl}`);
    
    try {
      // 转发请求（保持所有原始头和方法）
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'manual'
      });
      
      // 创建响应头
      const headers = new Headers(response.headers);
      
      // 添加 CORS 头
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      headers.set('Access-Control-Allow-Headers', '*');
      
      // 如果是 OPTIONS 预检请求
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: headers
        });
      }
      
      // 返回代理响应
      return new Response(response.body, {
        status: response.status,
        headers: headers
      });
      
    } catch (error) {
      // 错误处理
      console.error('代理错误:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: '加速代理失败',
        message: error.message,
        target: TARGET,
        timestamp: new Date().toISOString()
      }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
}
