const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/messages', { useNewUrlParser: true, useUnifiedTopology: true });

const Message = mongoose.model('Message', { text: String });

app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  const msg = new Message({ text: req.body.text });
  await msg.save();
  res.json(msg);
});

// Add this route to your Express backend
app.delete('/messages/newest', async (req, res) => {
  const newest = await Message.findOne().sort({ _id: -1 });
  if (newest) {
    await Message.deleteOne({ _id: newest._id });
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'No messages to delete' });
  }
});


// Update a message by ID
app.put('/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const updated = await Message.findByIdAndUpdate(id, { text }, { new: true });
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
