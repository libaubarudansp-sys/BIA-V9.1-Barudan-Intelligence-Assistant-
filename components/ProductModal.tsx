import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Textarea from './Textarea';
import Checkbox from './Checkbox';
import Button from './Button';
import Tabs, { Tab } from './Tabs';
import { IProduct, ISpecs, ProductFormFields } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<IProduct, 'id'>, id?: string) => void;
  editingProduct?: IProduct | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, editingProduct }) => {
  const initialFormState: ProductFormFields = {
    model_code: '',
    commercial_name: '',
    category: '',
    ncm_code: '',
    active: true,
    description: '',
    specs: {},
  };

  const [form, setForm] = useState<ProductFormFields>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingProduct) {
      setForm({
        model_code: editingProduct.model_code,
        commercial_name: editingProduct.commercial_name,
        category: editingProduct.category,
        ncm_code: editingProduct.ncm_code,
        active: editingProduct.active,
        description: editingProduct.description,
        specs: editingProduct.specs || {},
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [isOpen, editingProduct]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [id]: checked }));
    } else if (id.startsWith('specs.')) {
      const specKey = id.split('.')[1];
      setForm((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specKey]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSpecsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsedSpecs = JSON.parse(e.target.value);
      setForm((prev) => ({ ...prev, specs: parsedSpecs }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.specs;
        return newErrors;
      });
    } catch (err) {
      setErrors((prev) => ({ ...prev, specs: 'Formato JSON inválido para especificações.' }));
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.model_code) newErrors.model_code = 'Código do Modelo é obrigatório.';
    if (!form.commercial_name) newErrors.commercial_name = 'Nome Comercial é obrigatório.';
    if (!form.category) newErrors.category = 'Categoria é obrigatória.';
    if (!form.ncm_code) newErrors.ncm_code = 'NCM é obrigatório.';
    if (!form.description) newErrors.description = 'Descrição é obrigatória.';
    
    // Validate specs JSON
    try {
      if (form.specs && typeof form.specs === 'object' && Object.keys(form.specs).length > 0) {
        JSON.stringify(form.specs); // Just to ensure it's valid JSON structure
      }
    } catch (e) {
      newErrors.specs = 'Especificações devem ser um JSON válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(form as Omit<IProduct, 'id'>, editingProduct?.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingProduct ? 'Editar Produto' : 'Novo Produto'} className="max-w-4xl">
      <form onSubmit={handleSubmit} className="p-4">
        <Tabs initialActiveTab="Dados Gerais">
          <Tab label="Dados Gerais">
            <Input
              id="model_code"
              label="Código do Modelo"
              value={form.model_code}
              onChange={handleChange}
              error={errors.model_code}
              placeholder="Ex: BEKY-Y912"
            />
            <Input
              id="commercial_name"
              label="Nome Comercial"
              value={form.commercial_name}
              onChange={handleChange}
              error={errors.commercial_name}
              placeholder="Ex: Máquina Alta Velocidade"
            />
            <Input
              id="category"
              label="Categoria"
              value={form.category}
              onChange={handleChange}
              error={errors.category}
              placeholder="Ex: Bordado Plano, Cilíndrica, Especial"
            />
            <Input
              id="ncm_code"
              label="Código NCM"
              value={form.ncm_code}
              onChange={handleChange}
              error={errors.ncm_code}
              placeholder="Ex: 8447.90.90"
            />
            <Checkbox
              id="active"
              label="Produto Ativo"
              checked={form.active}
              onChange={handleChange}
            />
          </Tab>
          <Tab label="Dados Técnicos">
            <Textarea
              id="description"
              label="Descrição Técnica"
              value={form.description}
              onChange={handleChange}
              error={errors.description}
              rows={6}
              placeholder="Memorial descritivo técnico para propostas..."
            />
            <Textarea
              id="specs"
              label="Especificações (JSON)"
              value={JSON.stringify(form.specs, null, 2)}
              onChange={handleSpecsChange}
              error={errors.specs}
              rows={8}
              placeholder={`{\n  "needles": 12,\n  "heads": 1,\n  "embroidery_field": "500x360mm"\n}`}
            />
          </Tab>
        </Tabs>
        <div className="flex justify-end pt-4 mt-6 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar Produto
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;