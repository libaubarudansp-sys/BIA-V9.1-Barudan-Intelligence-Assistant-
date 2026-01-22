export interface ISpecs {
  needles?: number;
  heads?: number;
  embroidery_field?: string; // e.g., "500x360mm"
  dimensions?: string; // e.g., "W1200 x D800 x H1500mm"
  weight_kg?: number;
  power_consumption_kw?: number;
  [key: string]: any; // Allow for flexible additional specs
}

export interface IProduct {
  id: string; // Único, UUID
  model_code: string; // String, Único - Ex: "BEKY-Y912"
  commercial_name: string; // String - Ex: "Máquina Alta Velocidade"
  category: string; // String - Ex: "Bordado Plano", "Cilíndrica", "Especial"
  ncm_code: string; // String - Classificação Fiscal
  active: boolean; // Para "ligar/desligar" o produto no app
  description: string; // Text - Memorial descritivo técnico para propostas
  specs: ISpecs; // JSON/Object - Para detalhes como agulhas, cabeças, campo de bordado

  // Financial fields (hidden in initial form)
  price_net_jpy: number; // Preço de Tabela no Japão em Ienes
  price_fob_jpy: number; // Custo Real/Porto em Ienes
  tax_market_rate: number; // Taxa de Câmbio usada no cálculo
  tax_sales_factor: number; // Fator de Venda/Markup praticado
  price_final_brl: number; // O preço final de venda em Reais
}

export type ProductFormFields = Omit<IProduct, 'id' | 'price_net_jpy' | 'price_fob_jpy' | 'tax_market_rate' | 'tax_sales_factor' | 'price_final_brl'>;