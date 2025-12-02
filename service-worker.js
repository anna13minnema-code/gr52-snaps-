### **6️⃣ `service-worker.js`**

```javascript
self.addEventListener('install', () => {
  console.log('Service Worker installé');
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('Service Worker activé');
});

self.addEventListener('fetch', () => {});
```

---
