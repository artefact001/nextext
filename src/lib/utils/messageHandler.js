// utils/messageHandler.js
import messages from '../../theme/messages/components';

export const getMessage = (type, context) => {
  if (messages.themeComponentsMessages[type]) {
    return messages.themeComponentsMessages[type][context] || messages.themeComponentsMessages[type].default;
  }
  return messages.themeComponentsMessages.errors.default;
};

// Usage Example

