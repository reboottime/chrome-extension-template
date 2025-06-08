import { MESSAGE_ACTIONS } from "@utils/MessageUtils";

class Bridge {
  isSidePanelOpen: boolean = false;

  constructor() {
    // where you can initialize any listeners or setup code
    this.trackPanelStatus();
  }

  private trackPanelStatus = () => {
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.action === MESSAGE_ACTIONS.OPEN_SIDE_PANEL && !this.isSidePanelOpen) {
        try {
          await this.openPanel(sender)
          sendResponse({ success: true });
        } catch (error) {
          sendResponse({ success: false, error: (error as Error)?.message });
        }
        return true;
      }

      if (message.action === MESSAGE_ACTIONS.CLOSE_SIDE_PANEL) {
        this.isSidePanelOpen = false;
      }
    });
  }

  private openPanel = async (sender: chrome.runtime.MessageSender) => {
    try {
      await chrome.sidePanel.open({ windowId: sender?.tab?.windowId! });
      this.isSidePanelOpen = true;
    }
    catch (e) {
      console.error(e)
    }
  };
};

new Bridge();
