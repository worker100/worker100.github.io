// AI探索者网站 - Service Worker
// 版本号
const CACHE_NAME = 'ai-explorer-v1.0.0';
const STATIC_CACHE = 'ai-explorer-static-v1.0.0';
const DYNAMIC_CACHE = 'ai-explorer-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/favicon.ico',
  '/images/profile/profile.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap'
];

// 动态缓存的资源类型
const CACHEABLE_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.woff', '.woff2'];

// Service Worker 安装事件
self.addEventListener('install', event => {
  console.log('🔧 Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 缓存静态资源...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker 安装完成');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker 安装失败:', error);
      })
  );
});

// Service Worker 激活事件
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // 删除旧版本的缓存
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker 激活完成');
        return self.clients.claim();
      })
  );
});

// 网络请求拦截
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理 GET 请求
  if (request.method !== 'GET') return;
  
  // 跳过 chrome-extension 和其他非 HTTP 协议
  if (!url.protocol.startsWith('http')) return;
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // 如果缓存中有响应，返回缓存
        if (cachedResponse) {
          console.log('📦 从缓存获取:', request.url);
          
          // 对于静态资源，同时在后台更新缓存
          if (isStaticAsset(request.url)) {
            updateCache(request);
          }
          
          return cachedResponse;
        }
        
        // 缓存中没有，从网络获取
        return fetch(request)
          .then(response => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 决定是否缓存这个响应
            if (shouldCache(request.url)) {
              const responseToCache = response.clone();
              
              caches.open(getDynamicCacheName(request.url))
                .then(cache => {
                  console.log('💾 缓存新资源:', request.url);
                  cache.put(request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(error => {
            console.error('❌ 网络请求失败:', request.url, error);
            
            // 如果是导航请求且网络失败，返回离线页面
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // 对于其他资源，可以返回默认的占位符
            return new Response('离线模式', {
              status: 408,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          });
      })
  );
});

// 后台同步事件（如果支持）
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 执行后台同步');
    event.waitUntil(doBackgroundSync());
  }
});

// 推送通知事件（如果支持）
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 工具函数
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset));
}

function shouldCache(url) {
  // 检查是否是可缓存的文件类型
  return CACHEABLE_EXTENSIONS.some(ext => url.includes(ext)) ||
         url.includes('fonts.googleapis.com') ||
         url.includes('cdn.tailwindcss.com');
}

function getDynamicCacheName(url) {
  if (url.includes('images/') || url.includes('.jpg') || url.includes('.png')) {
    return 'ai-explorer-images-v1.0.0';
  }
  return DYNAMIC_CACHE;
}

function updateCache(request) {
  fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        caches.open(STATIC_CACHE)
          .then(cache => cache.put(request, response));
      }
    })
    .catch(error => {
      console.log('后台更新失败:', error);
    });
}

function doBackgroundSync() {
  // 这里可以实现后台数据同步逻辑
  return Promise.resolve();
}

// 缓存清理 - 限制缓存大小
function limitCacheSize(name, size) {
  caches.open(name)
    .then(cache => {
      cache.keys()
        .then(keys => {
          if (keys.length > size) {
            cache.delete(keys[0])
              .then(() => limitCacheSize(name, size));
          }
        });
    });
}

// 定期清理动态缓存
setInterval(() => {
  limitCacheSize(DYNAMIC_CACHE, 50);
  limitCacheSize('ai-explorer-images-v1.0.0', 30);
}, 60000); // 每分钟检查一次
