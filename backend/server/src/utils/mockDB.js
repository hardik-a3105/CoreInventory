// Mock in-memory database for offline development
const mockDB = {
  users: [],
  receipts: [],
  deliveries: [],
  transfers: [],
  products: [],
};

export const mockUser = {
  findOne: async (query) => {
    const { email } = query;
    return mockDB.users.find(u => u.email === email) || null;
  },
  
  findById: async (id) => {
    return mockDB.users.find(u => u._id === id) || null;
  },
  
  create: async (data) => {
    const user = {
      _id: `user_${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDB.users.push(user);
    return user;
  },
  
  findByIdAndUpdate: async (id, data) => {
    const user = mockDB.users.find(u => u._id === id);
    if (!user) return null;
    Object.assign(user, data, { updatedAt: new Date() });
    return user;
  },
};

export const mockOTP = {
  findOne: async (query) => {
    return null; // Mock OTP not used
  },
  
  create: async (data) => {
    return { _id: `otp_${Date.now()}`, ...data };
  },
  
  deleteMany: async (query) => {
    return { deletedCount: 0 };
  },
  
  deleteOne: async (query) => {
    return { deletedCount: 1 };
  },
};

export const mockProduct = {
  findMany: async (query) => {
    return [];
  },
  
  findOne: async (query) => {
    return null;
  },
  
  create: async (data) => {
    return { _id: `product_${Date.now()}`, ...data };
  },
};

export const mockReceipt = {
  find: async (query) => {
    return [];
  },
  
  findById: async (id) => {
    return null;
  },
  
  create: async (data) => {
    return { _id: `receipt_${Date.now()}`, ...data };
  },
};

// Fallback for all other models
export const createMockModel = (name) => ({
  find: async () => [],
  findById: async () => null,
  findOne: async () => null,
  create: async (data) => ({ _id: `${name}_${Date.now()}`, ...data }),
  countDocuments: async () => 0,
});

export default mockDB;
