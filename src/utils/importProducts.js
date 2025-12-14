import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities/Product";
const API_KEY = "606e7e263ef845baad3ffa5a49cfc4fb"; // From product.js

// Parse CSV line with proper handling of quoted fields containing commas
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current); // Add last field
  return result;
}

// Parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
  
  return { headers, rows };
}

// Parse JSON string safely
function parseJSONField(value) {
  if (!value || value.trim() === '' || value === '[]' || value === '{}') {
    return value === '[]' ? [] : value === '{}' ? {} : null;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    console.warn(`Failed to parse JSON: ${value}`, e.message);
    return null;
  }
}

// Convert CSV row to product data
function convertRowToProduct(row) {
  const product = {
    name: row.name || '',
    price: parseInt(row.price) || 0,
    category: row.category || 'unisex',
    subcategory: row.subcategory || '',
    type: row.type || '',
    description: row.description || '',
    material: row.material || '',
    care_instructions: row.care_instructions || '',
    images: parseJSONField(row.images) || [],
    colors: parseJSONField(row.colors) || [],
    sizes: parseJSONField(row.sizes) || [],
    size_chart: parseJSONField(row.size_chart) || [],
    stock: parseJSONField(row.stock) || {},
    is_bestseller: row.is_bestseller === 'true',
    is_new_arrival: row.is_new_arrival === 'true',
    weight: parseInt(row.weight) || 0,
  };
  
  // Add original_price if present
  if (row.original_price && row.original_price.trim() !== '') {
    product.original_price = parseInt(row.original_price);
  }
  
  return product;
}

// Create product via API
async function createProduct(productData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': API_KEY,
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Main import function
async function importProducts(csvFilePath) {
  console.log('Reading CSV file:', csvFilePath);
  const { headers, rows } = parseCSV(csvFilePath);
  
  console.log(`Found ${rows.length} products to import`);
  console.log('Headers:', headers);
  
  const results = {
    success: [],
    failed: [],
  };
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const productData = convertRowToProduct(row);
    
    console.log(`\n[${i + 1}/${rows.length}] Importing: ${productData.name}`);
    
    try {
      const result = await createProduct(productData);
      results.success.push({
        name: productData.name,
        id: result.id || result._id,
      });
      console.log(`✓ Success: ${productData.name}`);
    } catch (error) {
      results.failed.push({
        name: productData.name,
        error: error.message,
      });
      console.error(`✗ Failed: ${productData.name} - ${error.message}`);
    }
    
    // Add a small delay to avoid rate limiting
    if (i < rows.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n=== Import Summary ===');
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed products:');
    results.failed.forEach(item => {
      console.log(`  - ${item.name}: ${item.error}`);
    });
  }
  
  return results;
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                     process.argv[1]?.includes('importProducts.js');

if (isMainModule) {
  const csvPath = process.argv[2] || 'd:\\Downloads\\Product_export.csv';
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    console.log('Usage: node importProducts.js <path-to-csv>');
    console.log('Example: node importProducts.js "d:\\Downloads\\Product_export.csv"');
    process.exit(1);
  }
  
  importProducts(csvPath)
    .then(() => {
      console.log('\nImport completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { importProducts, parseCSV, convertRowToProduct };

