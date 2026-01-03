export default {
  async fetch(request) {
    // 目标服务器
    const TARGET = 'http://api1.123h.top:5000';
    
    // 构建目标 URL
    const url = new URL(request.url);
    const targetUrl = TARGET + url.pathname + url.search;
    
    console.log(`代理: ${url.href} -> ${targetUrl}`);
    
    try {
      // 转发请求
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // 添加 CORS 头
      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      
      // 返回响应
      return new Response(response.body, {
        status: response.status,
        headers: headers
      });
      
    } catch (error) {
      // 错误处理
      return new Response(JSON.stringify({
        error: '代理失败',
        message: error.message,
        target: TARGET
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
