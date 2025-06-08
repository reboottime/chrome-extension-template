// ===================================
// TYPES & INTERFACES
// ===================================

/**
 * Interface for message data - flexible structure for any message payload
 */
interface MessageData extends Record<string, any> {}

// ===================================
// MESSAGE CLASS
// ===================================

/**
 * Message class represents a structured message with action and optional data
 */
class Message {
  readonly action: string;
  readonly data?: MessageData;

  constructor(action: string, data?: MessageData) {
    this.action = action;
    this.data = data;
  }
}

// ===================================
// ACTION CONSTANTS
// ===================================
const MESSAGE_ACTIONS = {
  OPEN_SIDE_PANEL: "OPEN_SIDE_PANEL",
  CLOSE_SIDE_PANEL: "CLOSE_SIDE_PANEL",
  // where you can add more actions based on your needs
} as const;

// ===================================
// MESSAGE UTILITIES CLASS
// ===================================

/**
 * MessageUtils class provides static utility methods for Chrome extension messaging
 * with centralized runtime handling
 */
class MessageUtils {
  // ===================================
  // CORE MESSAGING METHOD
  // ===================================

  /**
   * Reusable method to send any message with centralized Chrome runtime handling
   * @param action - The action string for the message
   * @param data - Optional data payload
   */
  private static sendMessage(action: string, data?: MessageData): void {
    const message = new Message(action, data);
    chrome.runtime?.sendMessage?.(message);
  }

  // ===================================
  // PUBLIC API METHODS
  // ===================================

  /**
   * Sends a request to open the side panel
   */
  static requestOpenPanel(): void {
    this.sendMessage(MESSAGE_ACTIONS.OPEN_SIDE_PANEL);
  }

  /**
   * Sends a request to close the side panel
   */
  static requestClosePanel(): void {
    this.sendMessage(MESSAGE_ACTIONS.CLOSE_SIDE_PANEL);
  }

  //   ===================================//
  //   Where you can customize your own message methods
  //
}

// ===================================
// EXPORTS
// ===================================

export default MessageUtils;
export { Message, MESSAGE_ACTIONS };
export type { MessageData };
