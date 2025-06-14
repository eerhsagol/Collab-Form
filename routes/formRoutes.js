const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a form with fields
router.post('/forms', async (req, res) => {
  const { title, fields } = req.body;
  try {
    const result = await db.query('INSERT INTO forms (title) VALUES ($1) RETURNING id', [title]);
    const formId = result.rows[0].id;

    for (const field of fields) {
      await db.query(
        'INSERT INTO fields (form_id, label, type, options) VALUES ($1, $2, $3, $4)',
        [formId, field.label, field.type, field.options || null]
      );
    }

    res.status(201).json({ formId });
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get form structure by ID
router.get('/forms/:id', async (req, res) => {
  try {
    const form = await db.query('SELECT * FROM forms WHERE id = $1', [req.params.id]);
    const fields = await db.query('SELECT * FROM fields WHERE form_id = $1', [req.params.id]);
    res.json({ form: form.rows[0], fields: fields.rows });
  } catch (err) {
    console.error('Error fetching form:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start a new individual response for a user
router.post('/forms/:formId/start', async (req, res) => {
  const formId = req.params.formId;

  try {
    // Create new response row
    const responseResult = await db.query(
      'INSERT INTO responses (form_id) VALUES ($1) RETURNING id',
      [formId]
    );
    const responseId = responseResult.rows[0].id;

    // Get fields for the form
    const fieldResult = await db.query(
      'SELECT id FROM fields WHERE form_id = $1',
      [formId]
    );

    // Create field_responses
    for (const field of fieldResult.rows) {
      await db.query(
        'INSERT INTO field_responses (response_id, field_id, value) VALUES ($1, $2, $3)',
        [responseId, field.id, '']
      );
    }

    res.status(201).json({ responseId });
  } catch (err) {
    console.error('Error starting new response:', err);
    res.status(500).json({ error: err.message });
  }
});

// View all responses for a given form
router.get('/forms/:formId/responses', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.id AS response_id, fr.field_id, fr.value
       FROM responses r
       JOIN field_responses fr ON fr.response_id = r.id
       WHERE r.form_id = $1
       ORDER BY r.id, fr.field_id`,
      [req.params.formId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching responses:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;