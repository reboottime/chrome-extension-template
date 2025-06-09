# Options Page

Options page in a Chrome extension is a dedicated user interface that allows users to customize or configure the extension’s settings according to their preferences. It provides a way for users to enable or disable features, set preferences, or input data that affects how the extension behaves.

## Key Points About Options Pages

Purpose: Let users customize the extension’s behavior and features.

Access: Users can open the options page by right-clicking the extension icon and selecting "Options," or through the Chrome extensions page (chrome://extensions) via the "Details" link.

Types of options pages:

Full page: Opens as a separate tab in the browser. Declared in the manifest with "options_page": "options.html" (Manifest V2) or preferably "options_ui" in Manifest V3.

Embedded options: Displayed inside the extensions management page (chrome://extensions) in an embedded box. Declared with "options_ui": { "page": "options.html", "open_in_tab": false }.


### Types of options pages:

Full page: Opens as a separate tab in the browser. Declared in the manifest with "options_page": "options.html" (Manifest V2) or preferably "options_ui" in Manifest V3.

Embedded options: Displayed inside the extensions management page (chrome://extensions) in an embedded box. Declared with "options_ui": { "page": "options.html", "open_in_tab": false }.