const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Import routes
const usersRoutes = require('./routes/users.js');
const postsRoutes = require('./routes/posts.js');
const commentsRoutes = require('./routes/comments.js');
const likesRoutes = require('./routes/likes.js');
const messagesRoutes = require('./routes/messages.js');
const followersRoutes = require('./routes/followers.js');
const notificationsRoutes = require('./routes/notifications.js');

// Use routes
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/followers', followersRoutes);
app.use('/api/notifications', notificationsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
