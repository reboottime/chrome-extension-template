# Essential Concepts to Learn Before Chrome Extension Development

<ul>
 <li><strong>Web Workers</strong> are JavaScript threads that run in the background, separate from the main UI thread. They handle computationally intensive tasks without blocking the user interface.</li>
 
 <li><strong>Service Workers</strong> are programmable network proxies that sit between your web app and the network, enabling offline functionality, background sync, and push notifications. You can visit <a href='https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#download_install_and_activate'> mdn</a> to understand the lifecycle of a service worker.</li>
 
 <li><strong>Key Relationships</strong>:
   <ul>
     <li><strong>Main Thread ↔ Web Worker</strong>: Direct communication via postMessage API</li>
     <li><strong>Web App ↔ Service Worker</strong>: Acts as middleware for network requests</li>
     <li><strong>Service Worker ↔ Cache/Network</strong>: Manages resource fetching and caching strategies</li>
   </ul>
 </li>
 
 <li><strong>Communication Flow</strong>:
   <ul>
     <li>Main thread spawns web workers for heavy computation</li>
     <li>Service worker intercepts all network requests from the app</li>
     <li>Both can communicate back to main thread via message passing</li>
     <li>Service worker persists across browser sessions, web workers are ephemeral</li>
   </ul>
 </li>
</ul>


![Image](https://github.com/user-attachments/assets/673014d1-88bb-4583-b546-c7b6f406353e)


Both service worker and web worker can't access to DOM element.