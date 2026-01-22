import { IProduct, ISpecs } from '../types';

// Helper to generate a UUID (for mock data)
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Mock in-memory database
let mockProducts: IProduct[] = [
  {
    id: generateUUID(),
    model_code: 'BEKY-Y912',
    commercial_name: 'Máquina Alta Velocidade',
    category: 'Bordado Plano',
    ncm_code: '8447.90.90',
    active: true,
    description: 'Máquina de bordar plana de alta velocidade com 12 agulhas.',
    specs: {
      needles: 12,
      heads: 1,
      embroidery_field: '500x360mm',
      dimensions: 'W1200 x D800 x H1500mm',
      weight_kg: 250,
      power_consumption_kw: 1.5,
    },
    price_net_jpy: 1500000,
    price_fob_jpy: 1200000,
    tax_market_rate: 0.035,
    tax_sales_factor: 1.2,
    price_final_brl: 50000,
  },
  {
    id: generateUUID(),
    model_code: 'BEXY-S1506C',
    commercial_name: 'Máquina Cilíndrica Profissional',
    category: 'Cilíndrica',
    ncm_code: '8447.90.90',
    active: true,
    description: 'Máquina robusta para bordados cilíndricos e em peças montadas.',
    specs: {
      needles: 15,
      heads: 6,
      embroidery_field: '360x300mm',
      dimensions: 'W3000 x D1200 x H1800mm',
      weight_kg: 800,
      power_consumption_kw: 3.0,
    },
    price_net_jpy: 8000000,
    price_fob_jpy: 6500000,
    tax_market_rate: 0.035,
    tax_sales_factor: 1.25,
    price_final_brl: 280000,
  },
  {
    id: generateUUID(),
    model_code: 'LEM-100',
    commercial_name: 'Máquina de Bordado Lantejoulas',
    category: 'Especial',
    ncm_code: '8447.90.90',
    active: false,
    description: 'Equipamento especializado para aplicação de lantejoulas em alta produção.',
    specs: {
      needles: 9,
      heads: 1,
      embroidery_field: '400x400mm',
      sequin_device: true,
      dimensions: 'W1500 x D900 x H1600mm',
      weight_kg: 350,
      power_consumption_kw: 2.0,
    },
    price_net_jpy: 3000000,
    price_fob_jpy: 2500000,
    tax_market_rate: 0.035,
    tax_sales_factor: 1.3,
    price_final_brl: 120000,
  },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const productService = {
  getProducts: async (): Promise<IProduct[]> => {
    await simulateDelay(300); // Simulate network delay
    return [...mockProducts];
  },

  createProduct: async (productData: Omit<IProduct, 'id'>): Promise<IProduct> => {
    await simulateDelay(300); // Simulate network delay
    const newProduct: IProduct = {
      id: generateUUID(),
      ...productData,
      // Default financial values, as they are not managed in this form
      price_net_jpy: productData.price_net_jpy || 0,
      price_fob_jpy: productData.price_fob_jpy || 0,
      tax_market_rate: productData.tax_market_rate || 1,
      tax_sales_factor: productData.tax_sales_factor || 1,
      price_final_brl: productData.price_final_brl || 0,
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
    await simulateDelay(300); // Simulate network delay
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...productData };
      return mockProducts[index];
    }
    return null;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await simulateDelay(300); // Simulate network delay
    const initialLength = mockProducts.length;
    mockProducts = mockProducts.filter(p => p.id !== id);
    return mockProducts.length < initialLength;
  },

  // Helper for mock bulk import, assuming default financial fields
  createProductsBulk: async (productsData: Omit<IProduct, 'id' | 'price_net_jpy' | 'price_fob_jpy' | 'tax_market_rate' | 'tax_sales_factor' | 'price_final_brl'>[]): Promise<IProduct[]> => {
    await simulateDelay(500); // Simulate network delay for bulk operation
    const newProducts: IProduct[] = productsData.map(data => ({
      id: generateUUID(),
      ...data,
      // Default financial values
      price_net_jpy: 0,
      price_fob_jpy: 0,
      tax_market_rate: 1,
      tax_sales_factor: 1,
      price_final_brl: 0,
      specs: data.specs || {}, // Ensure specs is an object
    }));
    mockProducts.push(...newProducts);
    return newProducts;
  },
};