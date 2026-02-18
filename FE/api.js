
const BASE_URL = 'https://localhost:7022/api';

const getConfig = () => ({
  baseUrl: BASE_URL,
});

const safeFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) errorMessage = errorJson.message;
      } catch {}
      throw new Error(errorMessage || `API Error: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    if (err.message && (err.message === 'Failed to fetch' || err.message.includes('NetworkError'))) {
      throw new Error(`BACKEND_OFFLINE`);
    }
    throw err;
  }
};

export const api = {
  testConnection: async () => {
    const { baseUrl } = getConfig();
    try {
      await fetch(`${baseUrl}/People/GetAll`, { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' } });
      return true;
    } catch { return false; }
  },

  people: {
    getAll: async () => {
      const { baseUrl } = getConfig();
      const data = await safeFetch(`${baseUrl}/People/GetAll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      return data?.people || [];
    },
    getPaged: async (pageNumber = 1, pageSize = 10) => {
        const { baseUrl } = getConfig();
        return safeFetch(`${baseUrl}/People/GetPaged`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageNumber, pageSize })
        });
    },
    getById: async (id) => {
        const { baseUrl } = getConfig();
        return safeFetch(`${baseUrl}/People/GetById`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
    },
    create: async (person) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/People/Create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person)
      });
    },
    update: async (person) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/People/Update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person)
      });
    },
    delete: async (id) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/People/Delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    }
  },

  products: {
    getAll: async () => {
      const { baseUrl } = getConfig();
      const data = await safeFetch(`${baseUrl}/Product/GetAll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return data?.products || [];
    },
    getPaged: async (pageNumber = 1, pageSize = 10) => {
        const { baseUrl } = getConfig();
        return safeFetch(`${baseUrl}/Product/GetPaged`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageNumber, pageSize })
        });
    },
    getById: async (id) => {
        const { baseUrl } = getConfig();
        return safeFetch(`${baseUrl}/Product/GetById`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
    },
    create: async (product) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/Product/Create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    },
    update: async (product) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/Product/Update`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    },
    delete: async (id) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/Product/Delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    }
  },

  sales: {
    create: async (sale) => {
        const { baseUrl } = getConfig();
        return safeFetch(`${baseUrl}/Sale/Create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sale)
        });
    },
    getAll: async () => {
        const { baseUrl } = getConfig();
        const data = await safeFetch(`${baseUrl}/Sale/GetAll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return data?.sales || [];
    },
    getPaged: async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
        const { baseUrl } = getConfig();
        return safeFetch(`${baseUrl}/Sale/GetPaged`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageNumber, pageSize, searchTerm })
        });
    },
    getById: async (id) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/Sale/GetById`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ id })
     });
   },

   update: async (sale) => {
     const { baseUrl } = getConfig();
     return safeFetch(`${baseUrl}/Sale/Update`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(sale)
     });
   },
   
   delete: async (id) => {
      const { baseUrl } = getConfig();
      return safeFetch(`${baseUrl}/Sale/Delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }) 
      });
    }
 }
};