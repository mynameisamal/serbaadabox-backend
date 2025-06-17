const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationsByEmail,
} = require('../controllers/notificationController');

router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);      
router.delete('/', deleteAllNotifications);
router.get('/user', getNotificationsByEmail); 

module.exports = router;
