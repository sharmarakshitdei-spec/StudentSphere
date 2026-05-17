const Notification = require('../models/Notification');

const sendNotification = async (io, recipientId, title, message, type = 'info') => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type
    });

    // Emit to specific user if connected
    io.to(recipientId.toString()).emit('notification', notification);
    
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = sendNotification;
