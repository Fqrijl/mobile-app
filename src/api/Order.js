// JavaScript Example: Reading Entities
// Filterable fields: order_number, user_email, items, subtotal, shipping_cost, total, shipping_address, courier, payment_method, payment_status, order_status, tracking_number, tracking_history, payment_deadline
async function fetchOrderEntities() {
  const response = await fetch(
    `https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities/Order`,
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
// Filterable fields: order_number, user_email, items, subtotal, shipping_cost, total, shipping_address, courier, payment_method, payment_status, order_status, tracking_number, tracking_history, payment_deadline
async function updateOrderEntity(entityId, updateData) {
  const response = await fetch(
    `https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities/Order/${entityId}`,
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
