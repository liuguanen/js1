// worker.js 代码
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 修改请求目标
    const targetUrl = `http://api1.123h.top:5000${url.pathname}${url.search}`;
    
    // 创建新的请求
    const newRequest = new Request(targetUrl, request);
    
    // 添加必要的请求头
    newRequest.headers.set('Host', 'api1.123h.top');
    
    // 转发请求
    return fetch(newRequest);
  }
  }
