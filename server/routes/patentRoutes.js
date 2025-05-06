const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Patent = require('../models/Patent');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/patents/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('[Patent Upload] No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const patents = [];
    let currentPatent = null;

    for (const row of data) {
      const patent_number = row['Patent_number']?.toString();
      const assignees = row['Assignees'];
      const inventors = row['Inventors'];

      if (patent_number) {
        // Start a new patent
        if (currentPatent) {
          patents.push(currentPatent);
        }
        currentPatent = {
          patent_number,
          assignee: null,
          inventors: []
        };

        // Parse assignee
        if (assignees) {
          const assigneeMatch = assignees.match(/organization: ([^,]+), city: ([^,]*), state: ([^,]*), country: ([^,]+)/);
          if (assigneeMatch) {
            currentPatent.assignee = {
              organization: assigneeMatch[1].trim(),
              city: assigneeMatch[2].trim() || null,
              state: assigneeMatch[3].trim() || null,
              country: assigneeMatch[4].trim()
            };
          }
        }

        // Parse inventor
        if (inventors) {
          const inventorMatch = inventors.match(/first name: ([^,]+), last name: ([^,]+), city: ([^,]*), state: ([^,]*), country: ([^,]+)/);
          if (inventorMatch) {
            currentPatent.inventors.push({
              first_name: inventorMatch[1].trim(),
              last_name: inventorMatch[2].trim(),
              city: inventorMatch[3].trim() || null,
              state: inventorMatch[4].trim() || null,
              country: inventorMatch[5].trim()
            });
          }
        }
      } else if (currentPatent && inventors) {
        // Add additional inventor to current patent
        const inventorMatch = inventors.match(/first name: ([^,]+), last name: ([^,]+), city: ([^,]*), state: ([^,]*), country: ([^,]+)/);
        if (inventorMatch) {
          currentPatent.inventors.push({
            first_name: inventorMatch[1].trim(),
            last_name: inventorMatch[2].trim(),
            city: inventorMatch[3].trim() || null,
            state: inventorMatch[4].trim() || null,
            country: inventorMatch[5].trim()
          });
        }
      }
    }

    // Push the last patent
    if (currentPatent) {
      patents.push(currentPatent);
    }

    // Insert patents into MongoDB
    for (const patent of patents) {
      await Patent.findOneAndUpdate(
        { patent_number: patent.patent_number },
        patent,
        { upsert: true, new: true }
      );
      console.log(`[Patent Upload] Saved patent: ${patent.patent_number}`);
    }

    console.log(`[Patent Upload] Processed ${patents.length} patents`);
    res.status(200).json({ message: `${patents.length} patents processed successfully` });
  } catch (err) {
    console.error(`[Patent Upload] Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).json({ message: 'Error processing file' });
  }
});

// GET /api/patents
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('[Patent Fetch] No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(`[Patent Fetch] User not found: ${decoded.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const patents = await Patent.find();
    console.log(`[Patent Fetch] Fetched ${patents.length} patents for user: ${user.email}`);
    res.status(200).json(patents);
  } catch (err) {
    console.error(`[Patent Fetch] Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).json({ message: 'Error fetching patents' });
  }
});

// GET /api/patents/search
router.get('/search', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('[Patent Search] No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(`[Patent Search] User not found: ${decoded.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const { patent_numbers } = req.query;
    if (!patent_numbers) {
      console.log('[Patent Search] No patent numbers provided');
      return res.status(400).json({ message: 'Patent numbers are required' });
    }

    // Split comma-separated patent numbers and trim whitespace
    const patentNumberArray = patent_numbers.split(',').map(num => num.trim()).filter(num => num);
    if (patentNumberArray.length === 0) {
      console.log('[Patent Search] Empty patent numbers after parsing');
      return res.status(400).json({ message: 'No valid patent numbers provided' });
    }

    const patents = await Patent.find({ patent_number: { $in: patentNumberArray } });
    if (patents.length === 0) {
      console.log(`[Patent Search] No patents found for: ${patent_numbers}`);
      return res.status(404).json({ message: 'No patents found' });
    }

    console.log(`[Patent Search] Fetched ${patents.length} patents for user: ${user.email}`);
    res.status(200).json(patents);
  } catch (err) {
    console.error(`[Patent Search] Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).json({ message: 'Error searching patents' });
  }
});

module.exports = router;