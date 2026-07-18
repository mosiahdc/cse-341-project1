const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all contacts
// #swagger.tags = ['Contacts']
router.get('/', async (req, res) => {
    try {
        const contacts = await getDb().collection('contacts').find().toArray();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single contact by id
// #swagger.tags = ['Contacts']
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

// POST a new contact
// #swagger.tags = ['Contacts']
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newContact = { firstName, lastName, email, favoriteColor, birthday };
        const result = await getDb().collection('contacts').insertOne(newContact);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT (update) a contact by id
// #swagger.tags = ['Contacts']
router.put('/:id', async (req, res) => {
    try {
        const contactId = new ObjectId(req.params.id);
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await getDb()
            .collection('contacts')
            .replaceOne({ _id: contactId }, { firstName, lastName, email, favoriteColor, birthday });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a contact by id
// #swagger.tags = ['Contacts']
router.delete('/:id', async (req, res) => {
    try {
        const contactId = new ObjectId(req.params.id);
        const result = await getDb().collection('contacts').deleteOne({ _id: contactId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;