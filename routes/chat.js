const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// 📥 Client
router.get('/user/:email', chatController.getMessages);
router.post('/', chatController.sendMessage);

// 📤 Admin
router.get('/', chatController.getAllChats); // admin lihat daftar user
router.get('/users', chatController.getChatUsers); // daftar user unik
router.get('/unread-count', chatController.getUnreadCount); // ⬅️ FIXED HERE
router.get('/:email', chatController.getMessages); // lihat isi chat dengan user
router.post('/admin', chatController.sendAdminMessage);

router.patch('/:email/read', chatController.markMessagesAsRead);

module.exports = router;