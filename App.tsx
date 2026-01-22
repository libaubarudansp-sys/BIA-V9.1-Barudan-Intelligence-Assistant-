import React, { useState, useEffect, useCallback } from 'react';
import { IProduct } from './types';
import { productService } from './services/productService';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import Button from './components/Button';

const App: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Erro ao carregar produtos.');
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenNewProductModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product: IProduct) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData: Omit<IProduct, 'id'>, id?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await productService.updateProduct(id, productData);
      } else {
        await productService.createProduct(productData);
      }
      fetchProducts(); // Refresh list after save
    } catch (err) {
      setError(`Erro ao ${id ? 'atualizar' : 'criar'} produto.`);
      console.error('Failed to save product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setLoading(true);
      setError(null);
      try {
        await productService.deleteProduct(id);
        fetchProducts(); // Refresh list after delete
      } catch (err) {
        setError('Erro ao excluir produto.');
        console.error('Failed to delete product:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
          <span className="text-blue-600">BIA 2.0</span> - Gestão de Catálogo de Produtos
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" onClick={handleOpenNewProductModal}>
            Novo Produto
          </Button>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-lg text-gray-700">Carregando produtos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="my-6">
          <ProductTable products={products} onEdit={handleOpenEditProductModal} onDelete={handleDeleteProduct} />
        </div>
      )}

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default App;