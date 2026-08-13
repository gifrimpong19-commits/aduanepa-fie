import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Vendor, ProductItem } from '../../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Clock
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface MenuManagerProps {
  currentVendor: Vendor;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ currentVendor }) => {
  const { products, addProduct, updateProduct, deleteProduct } = useMarketplace();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Waakye Special');
  const [price, setPrice] = useState<string>('35');
  const [discountPercentage, setDiscountPercentage] = useState<string>('0');
  const [image, setImage] = useState<string>('');
  const [prepTime, setPrepTime] = useState<string>('15');
  const [dietaryTags, setDietaryTags] = useState<string>('Popular, Spicy');

  const vendorProducts = products.filter(p => p.vendorId === currentVendor.id);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory(currentVendor.categories[0] || 'Waakye Special');
    setPrice('40');
    setDiscountPercentage('0');
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setPrepTime('15');
    setDietaryTags('Campus Favorite, Spicy');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setCategory(p.category);
    setPrice(p.price.toString());
    setDiscountPercentage(p.discountPercentage?.toString() || '0');
    setImage(p.image);
    setPrepTime(p.preparationTimeMinutes.toString());
    setDietaryTags(p.dietaryTags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = dietaryTags.split(',').map(t => t.trim()).filter(Boolean);
    const numPrice = parseFloat(price) || 20;
    const numDiscount = parseFloat(discountPercentage) || 0;
    const numPrep = parseInt(prepTime) || 10;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        description,
        category,
        price: numPrice,
        discountPercentage: numDiscount > 0 ? numDiscount : undefined,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        preparationTimeMinutes: numPrep,
        dietaryTags: tags,
      });
    } else {
      addProduct({
        vendorId: currentVendor.id,
        name,
        description,
        category,
        price: numPrice,
        discountPercentage: numDiscount > 0 ? numDiscount : undefined,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
        preparationTimeMinutes: numPrep,
        dietaryTags: tags,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-extrabold text-lg text-stone-900">
            Menu Catalog & Pricing ({vendorProducts.length} Items)
          </h3>
          <p className="text-xs text-stone-500">
            Manage your food offerings, discounts, and preparation estimates
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-warm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish / Delicacy</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendorProducts.map((product) => {
          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-stone-200 p-4 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="space-y-3">
                <div className="relative h-36 rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discountPercentage && (
                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      {product.discountPercentage}% OFF Deal
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-stone-900/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {product.preparationTimeMinutes} mins
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <h4 className="font-display font-bold text-sm text-stone-900 mt-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="font-display font-black text-base text-stone-900">
                    GH₵ {product.price.toFixed(2)}
                  </span>
                  {product.discountPercentage && (
                    <span className="text-[10px] text-stone-400 line-through block">
                      GH₵ {(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title="Edit Item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${product.name}" from your menu?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Menu Dish' : 'Add New Menu Dish'}
        subtitle={currentVendor.businessName}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Dish / Item Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Smoky Party Jollof & Chicken"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Waakye Special, Jollof, Grills"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Description & Ingredients</label>
            <textarea
              rows={2}
              required
              placeholder="Describe the dish, portion size, and sides included..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Price (GH₵)</label>
              <input
                type="number"
                step="0.5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Discount (% Off)</label>
              <input
                type="number"
                min="0"
                max="90"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Prep Time (Mins)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="Popular, Spicy, Local Special, Bestseller"
              value={dietaryTags}
              onChange={(e) => setDietaryTags(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 text-xs font-bold bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-warm"
            >
              {editingProduct ? 'Save Changes' : 'Publish Dish to Menu'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
