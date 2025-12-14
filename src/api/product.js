// JavaScript Example: Reading Entities
// Filterable fields: name, price, original_price, category, subcategory, type, description, material, care_instructions, images, colors, sizes, size_chart, stock, is_bestseller, is_new_arrival, weight
async function fetchProductEntities() {
  const response = await fetch(
    `https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities/Product`,
    {
      headers: {
        api_key: "606e7e263ef845baad3ffa5a49cfc4fb", // or use await User.me() to get the API key
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, price, original_price, category, subcategory, type, description, material, care_instructions, images, colors, sizes, size_chart, stock, is_bestseller, is_new_arrival, weight
async function updateProductEntity(entityId, updateData) {
  const response = await fetch(
    `https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities/Product/${entityId}`,
    {
      method: "PUT",
      headers: {
        api_key: "606e7e263ef845baad3ffa5a49cfc4fb", // or use await User.me() to get the API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );
  const data = await response.json();
  console.log(data);
}
