const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// --- Helper: Custom CSV Parser ---
// Handles basic CSV with quoted fields. 
// Limitations: Simplified logic, might struggle with complex multi-line quotes if not careful.
const parseCSV = (text) => {
    const lines = text.split(/\r?\n/);
    const result = [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Regex to split by comma, ignoring commas inside quotes
        const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
        const matches = [];
        let match;
        while ((match = regex.exec(line)) !== null) {
            // Fix empty string match at end
            if (match.index === regex.lastIndex) regex.lastIndex++;
            if (match[1] !== undefined) matches.push(match[1].replace(/^"|"$/g, '').replace(/""/g, '"'));
        }

        // Simple split fallback if regex fails or for simple lines (faster/safer for simple data)
        // actually let's just use a simple state machine for robustness if regex is tricky?
        // Let's stick to a simpler "split by comma" but respect quotes.

        const row = {};
        let currentVal = '';
        let inQuotes = false;
        let colIndex = 0;

        for (let charIdx = 0; charIdx < line.length; charIdx++) {
            const char = line[charIdx];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                if (colIndex < headers.length) row[headers[colIndex]] = currentVal.trim();
                currentVal = '';
                colIndex++;
            } else {
                currentVal += char;
            }
        }
        // Push last val
        if (colIndex < headers.length) row[headers[colIndex]] = currentVal.trim().replace(/^"|"$/g, '');

        if (Object.keys(row).length > 0) result.push(row);
    }
    return result;
};

// @desc    Import Products via CSV
// @route   POST /api/bulk/import
// @access  Private/Seller
exports.importProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a CSV file' });
        }

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Parse
        const records = parseCSV(fileContent);
        const productsToInsert = [];
        const errors = [];

        for (const [index, row] of records.entries()) {
            // Validation
            if (!row.title || !row.price) {
                errors.push(`Row ${index + 2}: Missing Title or Price`);
                continue;
            }

            productsToInsert.push({
                title: row.title,
                price: parseFloat(row.price) || 0,
                description: row.description || 'No description',
                category: row.category || 'General',
                image: row.image || 'assets/no-image.png',
                stock: parseInt(row.stock) || 0,
                vendor: req.user._id,
                vendorName: req.user.storeName || 'Seller',
                status: 'pending' // Auto-approved? Or pending? Let's say pending.
            });
        }

        if (productsToInsert.length > 0) {
            await Product.insertMany(productsToInsert);
        }

        // Cleanup file
        fs.unlinkSync(filePath);

        res.json({
            message: `Imported ${productsToInsert.length} products.`,
            errors: errors.length > 0 ? errors : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during import' });
    }
};

// @desc    Export Products to CSV
// @route   GET /api/bulk/export
// @access  Private/Seller
exports.exportProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.user._id });

        const headers = ['Title', 'Price', 'Stock', 'Category', 'Description', 'Image'];
        const csvRows = [];

        // Add Header
        csvRows.push(headers.join(','));

        // Add Data
        products.forEach(p => {
            const row = [
                `"${p.title.replace(/"/g, '""')}"`,
                p.price,
                p.stock || 0,
                `"${(p.category || '').replace(/"/g, '""')}"`,
                `"${(p.description || '').replace(/"/g, '""')}"`,
                `"${(p.image || '').replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment('my_products.csv');
        res.send(csvString);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during export' });
    }
};
