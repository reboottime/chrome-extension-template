# Architecture

## Major Elements in Chrome Extension

| Component | Description | Who Can It Communicate With | Access to DOM |
|-----------|-------------|----------------------------|---------------|
| Service Worker | Background script that handles events, manages extension lifecycle, and performs tasks without a UI | Content scripts, popup, options, new tab, panel (via messaging APIs) | NO |
| Content Script | JavaScript that runs in the context of web pages and can interact with page content | Service worker, other content scripts (via messaging APIs) | YES |
| Popup | Small UI window that appears when clicking the extension icon in the toolbar | Service worker, content scripts (via messaging APIs) | YES (own popup DOM) |
| Options | Dedicated page for extension settings and configuration | Service worker, content scripts (via messaging APIs) | YES (own options page DOM) |
| New Tab | Custom page that replaces the browser's new tab page | Service worker, content scripts (via messaging APIs) | YES (own new tab page DOM) |
| Panel | Side panel UI that can be opened alongside web pages (Chrome 114+) | Service worker, content scripts (via messaging APIs) | YES (own panel DOM) |

**Key Notes:**

- All components communicate through Chrome's messaging APIs (`chrome.runtime.sendMessage`, `chrome.tabs.sendMessage`, etc.)
- Only content scripts can access and modify the DOM of web pages
- Other components can only access their own DOM contexts (popup, options, new tab, and panel have their own HTML documents)
- Service workers run in the background without any DOM access

## Primary Communication Methods between components

### Fundamental Measures

**1. Chrome Messaging APIs**

- `chrome.runtime.sendMessage()` - Send messages between components
- `chrome.runtime.onMessage` - Listen for messages from other components  
- `chrome.tabs.sendMessage()` - Send messages to specific tabs' content scripts
- Messages are asynchronous and can include response callbacks

**2. Chrome Storage APIs**

- `chrome.storage.local` - Local storage shared across all extension components
- `chrome.storage.sync` - Synced storage that follows the user across devices
- `chrome.storage.session` - Temporary storage for the browser session
- All components can read/write to storage and listen for changes via `chrome.storage.onChanged`

### Typical Data Flow Patterns

**Service Worker as Central Hub:**

```
Content Script → Service Worker → Storage
                      ↓
                 Other Components
```

**Direct Component Communication:**

```
Popup → Service Worker → Content Script
Options → Storage → All Components (via storage events)
```

### Common Synchronization Scenarios

**User Settings Changes:**

1. User modifies settings in Options page
2. Options page saves to `chrome.storage.sync`
3. Service worker detects storage change via `onChanged` event
4. Service worker notifies relevant content scripts of new settings
5. Content scripts update their behavior accordingly

**Cross-Tab Data Sharing:**

1. Content script in Tab A detects something important
2. Sends message to service worker
3. Service worker stores data and broadcasts to all tabs
4. Content scripts in other tabs receive updates

**Popup Requesting Current Tab Info:**

1. Popup opens and needs current page data
2. Popup sends message to service worker
3. Service worker queries active tab's content script
4. Content script responds with DOM data
5. Service worker relays response back to popup

The key is that service workers typically act as the coordination center, while storage APIs provide persistent state sharing across all components.
