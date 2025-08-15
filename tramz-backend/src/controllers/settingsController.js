const Settings = require('../models/Settings');

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));
const clean = (v) => String(v || '').trim();

exports.getContactRecipient = async (req, res) => {
  try {
    const doc = await Settings.findOne();
    res.json({ contactRecipient: doc?.contactRecipient || '' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.updateContactRecipient = async (req, res) => {
  try {
    const email = clean((req.body.contactRecipient || '').toLowerCase());
    if (email && !isEmail(email)) {
      return res.status(400).json({ msg: 'Invalid email' });
    }
    const updated = await Settings.findOneAndUpdate(
      {},
      { contactRecipient: email },
      { new: true, upsert: true }
    );
    res.json({ contactRecipient: updated.contactRecipient || '' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};
