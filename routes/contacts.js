const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await getDb().collection('contacts').find().toArray();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single contact by id
router.get('/:id', async (req, res) => {
    try {
        const contactId = new ObjectId(req.params.id);
        const contact = await getDb().collection('contacts').findOne({ _id: contactId });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;