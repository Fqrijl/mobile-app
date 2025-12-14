// JavaScript Example: Reading Entities
// Filterable fields: user_email, message, sender, is_read, attachment_url
async function fetchChatMessageEntities() {
  const response = await fetch(
    `https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities/ChatMessage`,
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
// Filterable fields: user_email, message, sender, is_read, attachment_url
async function updateChatMessageEntity(entityId, updateData) {
  const response = await fetch(
    `https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities/ChatMessage/${entityId}`,
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
