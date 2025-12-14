const BASE_URL =
  "https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a/entities";
const AUTH_URL = "https://app.base44.com/api/apps/693c2bcb0b1a5fbec395ad3a";

const API_KEY = import.meta.env.VITE_API_KEY || "606e7e263ef845baad3ffa5a49cfc4fb";

async function base44Fetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      api_key: API_KEY,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error: ${res.status} - ${error}`);
  }

  return res.json();
}

// Entity helper class
class Entity {
  constructor(name) {
    this.name = name;
  }

  async list(sort = "", limit = 100) {
    const params = [];
    if (sort) params.push(`sort=${sort}`);
    if (limit) params.push(`limit=${limit}`);
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    const url = `${BASE_URL}/${this.name}${queryString}`;
    const result = await base44Fetch(url);
    return Array.isArray(result) ? result : (result ? [result] : []);
  }

  async filter(filters, sort = "") {
    // If filtering by id, use get method instead
    if (filters && filters.id) {
      return this.get(filters.id).then(result => Array.isArray(result) ? result : [result]);
    }
    
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'id') {
          queryParams.append(key, value);
        }
      });
    }
    if (sort) {
      queryParams.append('sort', sort);
    }
    const url = `${BASE_URL}/${this.name}?${queryParams.toString()}`;
    const result = await base44Fetch(url);
    return Array.isArray(result) ? result : [result];
  }

  async get(id) {
    const url = `${BASE_URL}/${this.name}/${id}`;
    return base44Fetch(url);
  }

  async create(data) {
    const url = `${BASE_URL}/${this.name}`;
    return base44Fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id, data) {
    const url = `${BASE_URL}/${this.name}/${id}`;
    return base44Fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id) {
    const url = `${BASE_URL}/${this.name}/${id}`;
    return base44Fetch(url, {
      method: "DELETE",
    });
  }
}

// Auth helper
const auth = {
  async me() {
    const url = `${AUTH_URL}/auth/me`;
    return base44Fetch(url);
  },
  redirectToLogin() {
    window.location.href = `${AUTH_URL}/auth/login?redirect=${encodeURIComponent(window.location.href)}`;
  },
};

// Base44 client object
export const base44 = {
  entities: {
    Product: new Entity("Product"),
    Cart: new Entity("Cart"),
    Order: new Entity("Order"),
    Review: new Entity("Review"),
    FlashSale: new Entity("FlashSale"),
    Message: new Entity("Message"),
    ChatMessage: new Entity("ChatMessage"),
  },
  auth,
};

// Legacy export for backward compatibility
export async function base44Legacy(entity, options = {}) {
  return base44Fetch(`${BASE_URL}/${entity}`, options);
}
