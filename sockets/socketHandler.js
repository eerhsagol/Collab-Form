const db = require('../db');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join_form', (formId) => {
      socket.join(`form:${formId}`);
      console.log(`User joined form: ${formId}`);
    });

    socket.on('lock_field', async ({ fieldId, user }) => {
      try {
        await db.query(
          'UPDATE field_responses SET locked_by = $1, locked_at = NOW() WHERE field_id = $2',
          [user, fieldId]
        );
        io.to(`form:${fieldId}`).emit('field_locked', { fieldId, user });
      } catch (err) {
        console.error('Lock field error:', err);
      }
    });

    socket.on('update_field', async ({ fieldId, value, responseId }) => {
      try {
        const intFieldId = parseInt(fieldId);
        const intResponseId = parseInt(responseId);
        if (!isNaN(intFieldId) && !isNaN(intResponseId)) {
          await db.query(
            'UPDATE field_responses SET value = $1 WHERE field_id = $2 AND response_id = $3',
            [value, intFieldId, intResponseId]
          );
          io.to(`form:${intFieldId}`).emit('field_updated', { fieldId, value });
        } else {
          console.warn('Invalid fieldId or responseId received');
        }
      } catch (err) {
        console.error('Update field error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = socketHandler;
