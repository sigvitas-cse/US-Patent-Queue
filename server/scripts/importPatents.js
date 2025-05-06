const mongoose = require('mongoose');
const fs = require('fs');
const XLSX = require('xlsx');
const Patent = require('../models/Patent');
const path = require('path');

// Load .env from the project root
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Log MONGO_URI to verify
console.log('[Import Patents] MONGO_URI:', process.env.MONGO_URI || 'undefined');

// Specify the file path here
const filePath = './Jan - Apr 2025 (103338).xlsx'; // Relative to scripts/ directory

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('[Import Patents] MongoDB connected'))
  .catch(err => {
    console.error('[Import Patents] MongoDB connection error:', err);
    process.exit(1);
  });

// Function to parse multiple inventors from a single Inventors cell
const parseInventors = (inventorsString, patentNumber) => {
  if (!inventorsString || typeof inventorsString !== 'string') return [];

  // Log the raw inventors string for debugging
  if (patentNumber === '12185651') {
    console.log(`[Import Patents] Raw inventors string for patent ${patentNumber}:`, inventorsString);
  }

  // Split inventors by newline or other delimiters
  const inventorEntries = inventorsString.split(/\r?\n/).filter(entry => entry.trim());
  const inventors = [];

  const inventorRegex = /first name: ([^,]+), last name: ([^,]+), city: ([^,]*), state: ([^,]*), country: ([^,]+)/;

  for (const entry of inventorEntries) {
    const inventorMatch = entry.match(inventorRegex);
    if (inventorMatch) {
      inventors.push({
        first_name: inventorMatch[1].trim(),
        last_name: inventorMatch[2].trim(),
        city: inventorMatch[3].trim() || null,
        state: inventorMatch[4].trim() || null,
        country: inventorMatch[5].trim()
      });
    } else {
      console.warn(`[Import Patents] Skipping malformed inventor entry for patent ${patentNumber}: ${entry}`);
    }
  }

  if (patentNumber === '12185651') {
    console.log(`[Import Patents] Parsed inventors for patent ${patentNumber}:`, JSON.stringify(inventors, null, 2));
  }

  return inventors;
};

async function importPatents() {
  try {
    // Read Excel file
    if (!fs.existsSync(filePath)) {
      console.error(`[Import Patents] File not found: ${filePath}`);
      process.exit(1);
    }

    const workbook = XLSX.readFile(filePath);
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

        // Parse all inventors in the cell
        if (inventors) {
          currentPatent.inventors = parseInventors(inventors, patent_number);
        }
      } else if (currentPatent && inventors) {
        // Add additional inventors to current patent
        const additionalInventors = parseInventors(inventors, currentPatent.patent_number);
        currentPatent.inventors.push(...additionalInventors);
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
      console.log(`[Import Patents] Saved patent: ${patent.patent_number}`);
    }

    console.log(`[Import Patents] Processed ${patents.length} patents`);

    // Verify data for 12185651
    const patent = await Patent.findOne({ patent_number: "12185651" });
    console.log('[Import Patents] Patent 12185651 after import:', JSON.stringify(patent, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(`[Import Patents] Error: ${err.message}, Stack: ${err.stack}`);
    process.exit(1);
  }
}

importPatents();