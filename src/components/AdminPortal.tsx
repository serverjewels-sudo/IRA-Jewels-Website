import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Package,
  ShoppingBag,
  Heart,
  RefreshCw,
  FileCode,
  Check,
  ChevronRight,
  Eye,
  Settings,
  X,
  AlertCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  Tag,
  Hash,
  ExternalLink,
  Edit,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { Product, CartItem, OrderDetails } from '../types';
import {
  supabase,
  SQL_SCHEMA_GUIDE,
  getDbProducts,
  addDbProduct,
  deleteDbProduct,
  getDbCart,
  getDbWishlist,
  getDbOrders,
  updateDbOrderStatus,
  updateDbProductStock,
  updateDbProduct,
  mapDbProduct,
  getDbBespokeInquiries
} from '../supabase';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data';

interface AdminPortalProps {
  onClose: () => void;
  onRefreshCatalog: () => void;
  localProducts: Product[];
  onSetProducts: (prods: Product[]) => void;
  dbActive: boolean;
  setDbActive: (active: boolean) => void;
  onLogoutAdmin: () => void;
}

export default function AdminPortal({
  onClose,
  onRefreshCatalog,
  localProducts,
  onSetProducts,
  dbActive,
  setDbActive,
  onLogoutAdmin
}: AdminPortalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'orders' | 'interactions' | 'schema' | 'inquiries'>('overview');
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleAdminLogout = async (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      
      // Clear admin localStorage parameters
      localStorage.removeItem('luxeloom_admin_logged_in');
      localStorage.removeItem('luxeloom_admin_logged_in_time');
      
      await supabase.auth.signOut();
      
      // Hard redirect to admin login
      window.location.replace('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // States fetched from database
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbOrders, setDbOrders] = useState<OrderDetails[]>([]);
  const [dbCartItems, setDbCartItems] = useState<CartItem[]>([]);
  const [dbWishlisted, setDbWishlisted] = useState<Product[]>([]);
  const [dbBespokeInquiries, setDbBespokeInquiries] = useState<any[]>([]);

  // Product Creator state
  const [newProd, setNewProd] = useState<Partial<Product>>({
    id: '',
    name: '',
    category: 'Rings',
    categorySlug: 'rings',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    images: [],
    description: '',
    materials: ['18K Fine Solid Gold'],
    details: ['Artisan-cast prongs', 'BIS Hallmark Registered'],
    care: 'Complimentary lifetime storage and polishing',
    rating: 5,
    reviewsCount: 1,
    options: {
      metals: ['18K Yellow Gold', '18K White Gold'],
      sizes: ['5', '6', '7', '8']
    },
    sku: '',
    inStock: true,
    featured: true,
    bestseller: false,
    stockQuantity: 10
  });

  const [materialsInput, setMaterialsInput] = useState('18K Fine Solid Gold');
  const [detailsInput, setDetailsInput] = useState('Artisan-cast setting, BIS Hallmark Registered');

  // Editing Product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editMaterialsInput, setEditMaterialsInput] = useState('');
  const [editDetailsInput, setEditDetailsInput] = useState('');

  // Selected order details state for admin details modal view
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

  // Upload state managers
  const [addUploadState, setAddUploadState] = useState<{
    uploading: boolean;
    progress: number;
    success: boolean;
    error: string | null;
    preview: string | null;
  }>({
    uploading: false,
    progress: 0,
    success: false,
    error: null,
    preview: null
  });

  const [editUploadState, setEditUploadState] = useState<{
    uploading: boolean;
    progress: number;
    success: boolean;
    error: string | null;
    preview: string | null;
  }>({
    uploading: false,
    progress: 0,
    success: false,
    error: null,
    preview: null
  });

  const [addSelectedImageFiles, setAddSelectedImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [addPreviews, setAddPreviews] = useState<(string | null)[]>([null, null, null, null]);

  const [editSelectedImageFiles, setEditSelectedImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [editPreviews, setEditPreviews] = useState<(string | null)[]>([null, null, null, null]);
  const [editOldImageUrlsToDelete, setEditOldImageUrlsToDelete] = useState<(string | null)[]>([null, null, null, null]);

  const handleImageFileSelect = (file: File, index: number, isEdit: boolean) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
      alert('Please upload JPG, PNG or WEBP');
      return;
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      alert('Image must be less than 5MB');
      return;
    }

    if (isEdit) {
      setEditSelectedImageFiles(prev => {
        const copy = [...prev];
        copy[index] = file;
        return copy;
      });
      // Show preview immediately locally
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditPreviews(prev => {
          const copy = [...prev];
          copy[index] = e.target?.result as string;
          return copy;
        });
      };
      reader.readAsDataURL(file);
    } else {
      setAddSelectedImageFiles(prev => {
        const copy = [...prev];
        copy[index] = file;
        return copy;
      });
      // Show preview immediately locally
      const reader = new FileReader();
      reader.onload = (e) => {
        setAddPreviews(prev => {
          const copy = [...prev];
          copy[index] = e.target?.result as string;
          return copy;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImageAt = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditSelectedImageFiles(prev => {
        const copy = [...prev];
        copy[index] = null;
        return copy;
      });
      setEditPreviews(prev => {
        const copy = [...prev];
        copy[index] = null;
        return copy;
      });
    } else {
      setAddSelectedImageFiles(prev => {
        const copy = [...prev];
        copy[index] = null;
        return copy;
      });
      setAddPreviews(prev => {
        const copy = [...prev];
        copy[index] = null;
        return copy;
      });
    }
  };

  const uploadAllImages = async (
    files: (File | null)[],
    previews: (string | null)[],
    isEdit: boolean
  ): Promise<string[]> => {
    const setUploadState = isEdit ? setEditUploadState : setAddUploadState;
    
    setUploadState({
      uploading: true,
      progress: 25,
      success: false,
      error: null,
      preview: null
    });

    const finalUrls: string[] = [];

    for (let i = 0; i < 4; i++) {
      const file = files[i];
      const preview = previews[i];

      if (file) {
        // Upload new file to Supabase
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `product-${Date.now()}-${i}.${fileExt}`;

        try {
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            throw error;
          }

          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          finalUrls.push(urlData.publicUrl);
        } catch (err: any) {
          console.error(`Upload error for slot ${i}:`, err);
          setUploadState({
            uploading: false,
            progress: 0,
            success: false,
            error: `Image upload failed for slot ${i + 1}: ` + err.message,
            preview: null
          });
          throw err;
        }
      } else if (preview && preview.startsWith('http')) {
        // Keep existing URL
        finalUrls.push(preview);
      }
    }

    setUploadState({
      uploading: false,
      progress: 100,
      success: true,
      error: null,
      preview: finalUrls[0] || null
    });

    return finalUrls;
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setEditMaterialsInput(prod.materials.join(', '));
    setEditDetailsInput(prod.details.join(', '));
    
    // Initialize previews and selected files for multi-image edit
    const initialPreviews: (string | null)[] = [null, null, null, null];
    if (prod.images && prod.images.length > 0) {
      for (let i = 0; i < Math.min(prod.images.length, 4); i++) {
        initialPreviews[i] = prod.images[i];
      }
    } else if (prod.image) {
      initialPreviews[0] = prod.image;
    }

    setEditPreviews(initialPreviews);
    setEditSelectedImageFiles([null, null, null, null]);
    setEditOldImageUrlsToDelete([...initialPreviews]);

    setEditUploadState({
      uploading: false,
      progress: 0,
      success: false,
      error: null,
      preview: prod.image
    });
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    let activeSku = editingProduct.sku?.trim() || '';
    if (!activeSku) {
      const categoryStr = (editingProduct.category || 'Rings').toLowerCase();
      activeSku = `LLJ-${categoryStr}-${Date.now()}`;
    }

    setLoading(true);
    try {
      // Upload any new images & preserve existing ones
      const finalUrls = await uploadAllImages(editSelectedImageFiles, editPreviews, true);
      
      if (finalUrls.length === 0) {
        alert('Please add at least 1 image');
        setLoading(false);
        return;
      }

      const finalImageUrl = finalUrls[0];

      const itemToUpdate: Product = {
        ...editingProduct,
        image: finalImageUrl,
        images: finalUrls,
        categorySlug: editingProduct.category.toLowerCase(),
        materials: editMaterialsInput.split(',').map(m => m.trim()).filter(Boolean),
        details: editDetailsInput.split(',').map(d => d.trim()).filter(Boolean),
        price: Number(editingProduct.price || 0),
        sku: activeSku,
        stockQuantity: Number(editingProduct.stockQuantity !== undefined ? editingProduct.stockQuantity : 10)
      };

      if (dbActive) {
        const ok = await updateDbProduct(itemToUpdate);
        if (ok) {
          // Success! Clear old image if we updated with a new upload and old image was from supabase
          for (const oldUrl of editOldImageUrlsToDelete) {
            if (oldUrl && oldUrl.includes('product-images') && !finalUrls.includes(oldUrl)) {
              const oldFileName = oldUrl.split('/').pop();
              if (oldFileName) {
                await supabase.storage.from('product-images').remove([oldFileName]);
                console.log(`Old image deleted: ${oldFileName} ✅`);
              }
            }
          }

          setSuccessMsg(`Successfully updated masterpiece "${itemToUpdate.name}" in database!`);
          setEditingProduct(null);
          setEditSelectedImageFiles([null, null, null, null]);
          setEditPreviews([null, null, null, null]);
          setEditOldImageUrlsToDelete([null, null, null, null]);
          fetchAllAdminData();
          onRefreshCatalog();
        } else {
          setErrorMsg(`Unable to save updates for "${itemToUpdate.name}" in database.`);
        }
      } else {
        const updated = localProducts.map(p => p.id === itemToUpdate.id ? itemToUpdate : p);
        onSetProducts(updated);

        // Success! Clear old image if we updated with a new upload and old image was from supabase
        for (const oldUrl of editOldImageUrlsToDelete) {
          if (oldUrl && oldUrl.includes('product-images') && !finalUrls.includes(oldUrl)) {
            const oldFileName = oldUrl.split('/').pop();
            if (oldFileName) {
              await supabase.storage.from('product-images').remove([oldFileName]);
              console.log(`Old image deleted: ${oldFileName} ✅`);
            }
          }
        }

        setSuccessMsg(`Successfully updated masterpiece "${itemToUpdate.name}" in local storage memory!`);
        setEditingProduct(null);
        setEditSelectedImageFiles([null, null, null, null]);
        setEditPreviews([null, null, null, null]);
        setEditOldImageUrlsToDelete([null, null, null, null]);
        fetchAllAdminData();
        onRefreshCatalog();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving product updates.');
    } finally {
      setLoading(false);
    }
  };

  // Copy Schema to Clipboard status
  const [copied, setCopied] = useState<boolean>(false);

  // Admin fetch ALL orders:
  const fetchAllOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders error:', error);
        return;
      }

      // Map rows to OrderDetails matching Component state
      const mappedOrders = (data || []).map(dbOrder => ({
        orderNumber: dbOrder.order_number,
        customerInfo: {
          firstName: dbOrder.customer_first_name,
          lastName: dbOrder.customer_last_name,
          email: dbOrder.customer_email,
          phone: dbOrder.customer_phone || '',
          address: dbOrder.customer_address,
          city: dbOrder.customer_city,
          zipCode: dbOrder.customer_zip_code,
          country: dbOrder.customer_country
        },
        paymentInfo: {
          cardholderName: dbOrder.payment_cardholder_name || '',
          cardNumberMasked: dbOrder.payment_card_number_masked || ''
        },
        subtotal: Number(dbOrder.subtotal),
        shipping: Number(dbOrder.shipping),
        tax: Number(dbOrder.tax),
        discount: Number(dbOrder.discount || 0),
        total: Number(dbOrder.total),
        date: dbOrder.date,
        status: dbOrder.status || 'Placed',
        items: typeof dbOrder.items === 'string' ? JSON.parse(dbOrder.items) : dbOrder.items,
        utrNumber: dbOrder.utr_number || ''
      }));

      setDbOrders(mappedOrders);
      console.log('Orders loaded:', data?.length);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // STEP 6: CONSOLE LOG FOR DEBUGGING
  useEffect(() => {
    console.log('Orders data:', dbOrders);
    if (dbOrders && dbOrders.length > 0) {
      console.log('First order:', dbOrders[0]);
    }
  }, [dbOrders]);

  // STEP 4: ADD STATUS UPDATE FUNCTION
  const updateOrderStatus = async (orderNumber: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('order_number', orderNumber);

      if (error) throw error;

      // Update local state
      setDbOrders(prev => 
        prev.map(order => 
          order.orderNumber === orderNumber
            ? { ...order, status: newStatus }
            : order
        )
      );

      setSuccessMsg(`OrderStatus updated successfully to: ${newStatus} ✅`);
      alert('Order status updated ✅');
    } catch (error: any) {
      console.error('Update error:', error);
      setErrorMsg(error.message || 'Failed to update status');
      alert('Failed to update status');
    }
  };

  // Fetch Bespoke Inquiries:
  const fetchAllInquiries = async () => {
    try {
      const data = await getDbBespokeInquiries();
      setDbBespokeInquiries(data);
    } catch (error) {
      console.error('Inquiries load error:', error);
    }
  };

  // STEP 5: ADD ORDER DETAILS VIEW
  const viewOrderDetails = (order: OrderDetails) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Admin fetch ALL cart items:
  const fetchAllCarts = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Cart error:', error);
        return;
      }

      const mappedCarts: CartItem[] = (data || [])
        .filter(item => item.products)
        .map(item => ({
          id: item.id,
          selectedMetal: item.selected_metal,
          selectedSize: item.selected_size || undefined,
          engraving: item.engraving || undefined,
          quantity: item.quantity,
          product: mapDbProduct(item.products)
        }));

      setDbCartItems(mappedCarts);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Admin fetch ALL wishlists:
  const fetchAllWishlists = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Wishlist error:', error);
        return;
      }

      const mappedWishlists: Product[] = (data || [])
        .filter(item => item.products)
        .map(item => mapDbProduct(item.products));

      setDbWishlisted(mappedWishlists);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch admin items
  const fetchAllAdminData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Products
      const { products, dbActive: isSynced, error } = await getDbProducts();
      setDbActive(isSynced);
      if (error) {
        console.warn('Supabase not fully provisioned:', error);
      }
      setDbProducts(products);

      // Orders, Carts, Wishlists
      await fetchAllOrders();
      await fetchAllCarts();
      await fetchAllWishlists();
      await fetchAllInquiries();

    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchAllCarts();
    fetchAllWishlists();
    fetchAllInquiries();

    // Also load initial products
    getDbProducts().then(res => {
      setDbActive(res.dbActive);
      setDbProducts(res.products);
    }).catch(console.error);
  }, []);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_GUIDE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Seeding local data.ts PRODUCTS to Supabase with automatic setup check
  const handleSeedProducts = async () => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    let successCount = 0;
    try {
      for (const prod of INITIAL_PRODUCTS) {
        const ok = await addDbProduct(prod);
        if (ok) successCount++;
      }
      if (successCount > 0) {
        setSuccessMsg(`Successfully seeded ${successCount} boutique items to Supabase!`);
        fetchAllAdminData();
        onRefreshCatalog();
      } else {
        setErrorMsg('Failed to seed products. Please ensure SQL tables match the database schema in the SQL Schema tab.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Seeding failed. Verify your SQL connection.');
    } finally {
      setLoading(false);
    }
  };

  // Add custom listed product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newProd.id || !newProd.name) {
      setErrorMsg('Product ID and Name are required fields.');
      return;
    }

    // Auto-generate SKU if empty: LLJ-category-timestamp
    let activeSku = newProd.sku?.trim() || '';
    if (!activeSku) {
      const categoryStr = (newProd.category || 'Rings').toLowerCase();
      activeSku = `LLJ-${categoryStr}-${Date.now()}`;
    }

    setLoading(true);
    try {
      // Upload all selected local image files
      const finalUrls = await uploadAllImages(addSelectedImageFiles, addPreviews, false);

      if (finalUrls.length === 0) {
        alert('Please add at least 1 image');
        setLoading(false);
        return;
      }

      const finalImageUrl = finalUrls[0];

      const itemToAdd: Product = {
        id: newProd.id.trim(),
        name: newProd.name.trim(),
        category: newProd.category as any,
        categorySlug: (newProd.category as string).toLowerCase(),
        price: Number(newProd.price || 0),
        image: finalImageUrl,
        images: finalUrls,
        description: newProd.description || 'Dainty bespoke collection',
        materials: materialsInput.split(',').map(m => m.trim()).filter(Boolean),
        details: detailsInput.split(',').map(d => d.trim()).filter(Boolean),
        care: newProd.care || 'Wipe gently with clean tissue.',
        rating: Number(newProd.rating || 5),
        reviewsCount: Number(newProd.reviewsCount || 1),
        options: {
          metals: newProd.options?.metals || ['18K Yellow Gold'],
          sizes: newProd.options?.sizes?.length ? newProd.options.sizes : undefined
        },
        inStock: !!newProd.inStock,
        featured: !!newProd.featured,
        bestseller: !!newProd.bestseller,
        sku: activeSku,
        stockQuantity: Number(newProd.stockQuantity !== undefined ? newProd.stockQuantity : 10)
      };

      const ok = await addDbProduct(itemToAdd);
      if (ok) {
        setSuccessMsg(`Listed "${itemToAdd.name}" successfully to Supabase!`);
        // Reset state
        setNewProd({
          id: '',
          name: '',
          category: 'Rings',
          categorySlug: 'rings',
          price: 150000,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
          images: [],
          description: '',
          materials: ['18K Fine Solid Gold'],
          details: ['Artisan-cast prongs', 'BIS Hallmark Registered'],
          care: 'Complimentary lifetime storage and polishing',
          rating: 5,
          reviewsCount: 1,
          options: {
            metals: ['18K Yellow Gold', '18K White Gold'],
            sizes: ['5', '6', '7', '8']
          },
          sku: '',
          inStock: true,
          featured: true,
          bestseller: false,
          stockQuantity: 10
        });
        setAddSelectedImageFiles([null, null, null, null]);
        setAddPreviews([null, null, null, null]);
        setAddUploadState({
          uploading: false,
          progress: 0,
          success: false,
          error: null,
          preview: null
        });
        setMaterialsInput('18K Fine Solid Gold');
        setDetailsInput('Artisan-cast setting, BIS Hallmark Registered');
        fetchAllAdminData();
        onRefreshCatalog();
      } else {
        setErrorMsg('Could not insert product. Ensure the table is created and there are no duplicate IDs.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving product.');
    } finally {
      setLoading(false);
    }
  };

  // Delist Product
  const handleDelistProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delist "${name}"? This removes it permanently from the Supabase showcase.`)) return;

    setLoading(true);
    try {
      const ok = await deleteDbProduct(id);
      if (ok) {
        setSuccessMsg(`Successfully delisted "${name}"`);
        fetchAllAdminData();
        onRefreshCatalog();
      } else {
        setErrorMsg(`Failed to delete "${name}".`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Deletion error.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle/Relist Product Stock
  const handleToggleProductStock = async (id: string, currentInStock: boolean, name: string) => {
    setLoading(true);
    try {
      if (dbActive) {
        const ok = await updateDbProductStock(id, !currentInStock);
        if (ok) {
          setSuccessMsg(`Successfully updated status of "${name}" to ${!currentInStock ? 'In Stock' : 'Out of Stock'}`);
          fetchAllAdminData();
          onRefreshCatalog();
        } else {
          setErrorMsg(`Failed to update status for "${name}".`);
        }
      } else {
        const updated = localProducts.map(p => p.id === id ? { ...p, inStock: !currentInStock } : p);
        onSetProducts(updated);
        setSuccessMsg(`Successfully updated mock status of "${name}" to ${!currentInStock ? 'In Stock font status' : 'Out of Stock'}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Status update error.');
    } finally {
      setLoading(false);
    }
  };

  // Change Status Order
  const handleUpdateStatus = async (orderNum: string, newStatus: string) => {
    try {
      const ok = await updateDbOrderStatus(orderNum, newStatus);
      if (ok) {
        setSuccessMsg(`Updated status of ${orderNum} to: ${newStatus}`);
        fetchAllAdminData();
      } else {
        setErrorMsg('Failed to update status.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Status change failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none text-[#0a0a0a]">
      {/* Upper header action banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1a6b5c]/25 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest font-mono text-[#1a6b5c] font-medium">
            <Database size={14} className="animate-pulse" />
            <span>Supabase Cloud Console</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${dbActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {dbActive ? '● INTEGRATED ONLIVE' : '○ FALLBACK OFFLINE'}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-900 mt-1">Atelier Controller Portal</h1>
          <p className="text-xs text-neutral-500 font-light mt-0.5">Real-time inventory provisioning, order orchestration and client interaction analytics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAdminLogout}
            disabled={isLoggingOut}
            className="bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-widest py-3 px-6 rounded-sm flex items-center space-x-2 transition-all shadow-md pointer-events-auto"
            style={{
              opacity: isLoggingOut ? 0.6 : 1,
              cursor: isLoggingOut ? 'not-allowed' : 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout Admin'}</span>
          </button>
          <button
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest py-3 px-6 rounded-sm flex items-center space-x-2 transition-all shadow-md pointer-events-auto cursor-pointer"
          >
            <X size={14} />
            <span>Exit Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Success / Error Toast notification blocks */}
      {successMsg && (
        <div className="p-4 mb-6 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2 animate-fade-in font-mono">
          <Check size={16} className="bg-emerald-600 text-white rounded-full p-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-6 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in font-mono">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Supabase Operation Action Notice</p>
            <p className="text-neutral-600 leading-relaxed">{errorMsg}</p>
            {!dbActive && (
              <p className="text-zinc-500 text-[11px] pt-1 leading-snug">
                *Setup requirement: If tables do not exist yet, click the <strong>SQL Schema Setup Instructions</strong> tab below, copy the SQL scripts, and run them inside your Supabase SQL Editor.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'overview', label: 'Console Overview', icon: Database },
            { id: 'products', label: 'Bespoke Products', icon: Package },
            { id: 'orders', label: 'Order Orchestration', icon: ShoppingBag },
            { id: 'inquiries', label: 'Bespoke Inquiries', icon: MessageSquare },
            { id: 'interactions', label: 'Live Interactions', icon: Heart },
            { id: 'schema', label: 'SQL Schema Setup', icon: FileCode }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id as any);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`w-full text-left px-4 py-3 border border-r-0 text-xs uppercase tracking-widest font-mono flex items-center justify-between transition-all rounded-xs cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-[#1a6b5c] text-white font-bold border-[#1a6b5c]'
                    : 'bg-white hover:bg-[#1a6b5c]/5 text-[#0a0a0a]/75 border-zinc-200 hover:text-[#1a6b5c]'
                }`}
              >
                <span className="flex items-center space-x-2.5">
                  <IconComp size={15} />
                  <span>{tab.label}</span>
                </span>
                <ChevronRight size={12} className={`${activeSubTab === tab.id ? 'translate-x-1' : 'opacity-30'}`} />
              </button>
            );
          })}

          <div className="mt-8 p-4 bg-amber-50/50 border border-amber-300/65 rounded-sm space-y-2 text-xs font-serif leading-relaxed">
            <h4 className="font-semibold text-amber-950 flex items-center space-x-1">
              <span className="text-lg">📢</span>
              <span>Need initial dataset?</span>
            </h4>
            <p className="text-[11px] text-amber-900 font-sans leading-normal">
              If your Supabase `products` table is empty after schema publication, click below to push 12 hand-carved template pieces.
            </p>
            <button
              onClick={handleSeedProducts}
              disabled={loading}
              className="mt-2 w-full bg-amber-900 hover:bg-amber-950 text-white text-[10px] uppercase tracking-wider font-semibold py-2 px-3 border border-transparent rounded-xs transition-colors flex items-center justify-center space-x-1 pointer-events-auto cursor-pointer"
            >
              <RefreshCw size={11} className={`${loading ? 'animate-spin' : ''}`} />
              <span>Seed Template Products</span>
            </button>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="lg:col-span-3 bg-white border border-[#1a6b5c]/15 p-6 sm:p-8 rounded-sm shadow-sm min-h-[450px]">
          
          {/* OVERVIEW PANEL */}
          {activeSubTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-serif text-2xl text-zinc-900 font-light uppercase tracking-wide">Live Dashboard Analytics</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Secure system status, transactional telemetry, and table rows cataloged dynamically.</p>
              </div>

              {/* Statistical Bento Card list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
                
                {/* Products Stat Block */}
                <div className="bg-zinc-50 border border-zinc-200/50 p-4 rounded-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start text-zinc-400">
                    <span className="uppercase tracking-widest text-[9px] font-semibold">Active Products</span>
                    <Package size={14} className="text-[#1a6b5c]" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold font-serif text-zinc-950">{dbActive ? dbProducts.length : localProducts.length}</span>
                    <span className="text-[9px] text-[#1a6b5c]/70">{dbActive ? 'Supabase' : 'Offline Static'}</span>
                  </div>
                </div>

                {/* Orders Stat Block */}
                <div className="bg-zinc-50 border border-zinc-200/50 p-4 rounded-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start text-zinc-400">
                    <span className="uppercase tracking-widest text-[9px] font-semibold">Prestige Orders</span>
                    <ShoppingBag size={14} className="text-[#1a6b5c]" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold font-serif text-[#1a6b5c]">{dbOrders.length}</span>
                    <span className="text-[9px] text-neutral-500">Live DB</span>
                  </div>
                </div>

                {/* Interactions Stat Block */}
                <div className="bg-zinc-50 border border-zinc-200/50 p-4 rounded-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start text-zinc-400">
                    <span className="uppercase tracking-widest text-[9px] font-semibold">Live Carts & Wish</span>
                    <Heart size={14} className="text-[#1a6b5c]" />
                  </div>
                  <div className="flex items-baseline space-x-1 flex-wrap">
                    <span className="text-3xl font-bold font-serif text-[#0a0a0a]">{dbCartItems.length + dbWishlisted.length}</span>
                    <span className="text-[9px] text-neutral-500">({dbCartItems.length} Cart / {dbWishlisted.length} Wish)</span>
                  </div>
                </div>

              </div>

              {/* Status and instructions */}
              <div className="bg-[#f5f0eb]/40 border border-[#1a6b5c]/10 rounded-sm p-6 space-y-4">
                <h4 className="font-serif text-lg font-semibold text-[#1a6b5c] flex items-center space-x-1.5">
                  <span>⚙️</span>
                  <span>Supabase Endpoint Configuration Details</span>
                </h4>
                
                <div className="divide-y divide-[#1a6b5c]/10 text-xs space-y-3 pt-1">
                  <div className="flex justify-between py-2 font-mono">
                    <span className="text-[#666]">Supabase Project Reference ID</span>
                    <span className="font-semibold text-zinc-900">tvftfzeroallfzzzfvmi</span>
                  </div>
                  <div className="flex justify-between py-2 font-mono">
                    <span className="text-[#666]">API Target URL</span>
                    <span className="text-neutral-800 break-all max-w-[250px] font-semibold">https://tvftfzeroallfzzzfvmi.supabase.co</span>
                  </div>
                  <div className="flex justify-between py-2 font-mono">
                    <span className="text-[#666]">Publishable Public Key Status</span>
                    <span className="text-green-700 font-semibold text-[11px]">ACTIVE AUTHORIZED SECURITY</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-dotted border-[#1a6b5c]/25 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                  <span className="text-zinc-500 font-light">To refresh database numbers manually click:</span>
                  <button
                    onClick={fetchAllAdminData}
                    disabled={loading}
                    className="bg-transparent border border-[#1a6b5c] text-[#1a6b5c] hover:bg-[#1a6b5c] hover:text-white px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-xs pointer-events-auto cursor-pointer"
                  >
                    Refresh Real-time Numbers
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BESPOKE PRODUCT MANAGEMENT PANEL */}
          {activeSubTab === 'products' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-serif text-2xl text-zinc-900 font-light uppercase tracking-wide">Bespoke Store Showcase Catalog</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Upload luxury collections dynamically to Supabase or delist pieces instantly.</p>
              </div>

              {/* Listing Form */}
              <details className="bg-neutral-50 border border-zinc-200/60 rounded-sm p-4 group select-none">
                <summary className="text-xs uppercase font-mono tracking-wider font-semibold text-[#1a6b5c] cursor-pointer flex justify-between items-center select-none pointer-events-auto">
                  <span className="flex items-center space-x-2">
                    <Plus size={14} />
                    <span>List a Custom Masterpiece (Add Product)</span>
                  </span>
                  <span className="group-open:rotate-180 transition-transform">&darr;</span>
                </summary>

                <form onSubmit={handleCreateProduct} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-800 border-t border-neutral-200/50 pt-5 select-none uppercase font-mono tracking-widest text-[10px]">
                  <div>
                    <label className="block text-[#666] mb-1 font-semibold">Unique Product ID (e.g., ring-monica-cushion-ruby)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ruby-cushion-ring-monica"
                      value={newProd.id}
                      onChange={(e) => setNewProd({...newProd, id: e.target.value.toLowerCase().replace(/\s/g, '-')})}
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666] mb-1 font-semibold">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Monica Cushion Cut Royal Ruby Ring"
                      value={newProd.name}
                      onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666] mb-1 font-semibold">Price (INR ₹)</label>
                    <input
                      type="number"
                      required
                      value={newProd.price}
                      onChange={(e) => setNewProd({...newProd, price: Number(e.target.value)})}
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666] mb-1 font-semibold">SKU identifier (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave blank to auto-generate SKU"
                      value={newProd.sku}
                      onChange={(e) => setNewProd({...newProd, sku: e.target.value})}
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666] mb-1 font-semibold">Collection Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({...newProd, category: e.target.value as any})}
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal"
                    >
                      <option value="Rings">Rings</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Pendants">Pendants</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Bangles">Bangles</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Nosepins">Nosepins</option>
                    </select>
                  </div>

                  {/* PRODUCT IMAGES SECTION */}
                  <div className="sm:col-span-2 border border-zinc-200 p-4 bg-zinc-50/50 rounded-sm space-y-4 font-sans">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-150 pb-2">
                      <label className="block text-[#1a6b5c] font-bold tracking-wider text-xs font-mono uppercase">
                        PRODUCT IMAGES (Max 4)
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        JPG, PNG, WEBP • Max 5MB each
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                      {[0, 1, 2, 3].map((index) => {
                        const preview = addPreviews[index];
                        const isMain = index === 0;

                        return (
                          <div key={index} className="flex flex-col space-y-1">
                            <div
                              onClick={() => {
                                if (!preview) {
                                  document.getElementById(`image-add-input-${index}`)?.click();
                                }
                              }}
                              className={`relative aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 text-center transition duration-200 overflow-hidden bg-white group shadow-xs select-none ${
                                preview 
                                  ? 'border-zinc-200' 
                                  : 'border-[#1a6b5c]/70 hover:border-[#1a6b5c] hover:bg-neutral-50 cursor-pointer'
                              }`}
                              style={{ minHeight: '110px' }}
                            >
                              {preview ? (
                                <>
                                  <img 
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeImageAt(index, false);
                                    }}
                                    className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold pointer-events-auto cursor-pointer shadow-md border border-white transition"
                                    title="Remove Image"
                                  >
                                    ✕
                                  </button>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center space-y-1 select-none pointer-events-none">
                                  <span className="text-2xl text-[#1a6b5c] group-hover:scale-110 transition duration-300">
                                    +
                                  </span>
                                  <span className="font-semibold text-zinc-600 text-[10px]">
                                    Upload
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <input
                              id={`image-add-input-${index}`}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleImageFileSelect(file, index, false);
                              }}
                            />

                            <div className="text-center">
                              <span className={`text-[9px] font-bold uppercase tracking-wider font-mono ${
                                isMain ? 'text-[#1a6b5c]' : 'text-zinc-400'
                              }`}>
                                {isMain ? 'Main Image' : `Additional ${index}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {addUploadState.uploading && (
                      <div className="text-[#1a6b5c] text-[10px] font-semibold flex flex-col items-center space-y-1 font-mono pt-1">
                        <span className="animate-pulse">⏳ Processing & uploading images ({addUploadState.progress}%)...</span>
                        <div className="w-48 bg-neutral-200 rounded-full h-1 overflow-hidden mt-1">
                          <div
                            className="bg-[#1a6b5c] h-1 rounded-full transition-all duration-350"
                            style={{ width: `${addUploadState.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {addUploadState.success && (
                      <div className="text-emerald-700 text-[10px] font-semibold flex items-center justify-center space-x-1.5 py-1 font-mono">
                        <span>✅</span>
                        <span>All product images uploaded successfully!</span>
                      </div>
                    )}

                    {addUploadState.error && (
                      <div className="text-red-600 text-[10px] font-semibold flex items-center justify-center space-x-1.5 py-1 font-mono">
                        <span>❌</span>
                        <span>{addUploadState.error}</span>
                      </div>
                    )}

                    {/* URL Field - auto-filled OR manual */}
                    <div className="mt-3">
                      <label className="block text-[#666] mb-1 font-semibold">SPLENDID IMAGE URL (auto-filled after upload)</label>
                      <input
                        type="url"
                        placeholder="Auto-filled after upload or paste URL manually"
                        value={newProd.image}
                        onChange={(e) => setNewProd({...newProd, image: e.target.value})}
                        className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#666] mb-1 font-semibold">Materials Accents (Comma-separated list)</label>
                    <input
                      type="text"
                      value={materialsInput}
                      onChange={(e) => setMaterialsInput(e.target.value)}
                      placeholder="e.g. Traditional Solid 22K Gold, Royal Red Cushion cut Ruby, GIA VS1 diamonds"
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#666] mb-1 font-semibold">Atelier Details Checklist (Comma-separated list)</label>
                    <input
                      type="text"
                      value={detailsInput}
                      onChange={(e) => setDetailsInput(e.target.value)}
                      placeholder="e.g. BIS Hallmark Registered, Natural Ethically Sourced Gem, Handcrafted in Jaipur"
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#666] mb-1 font-semibold">Exquisite Narrative / Description</label>
                    <textarea
                      value={newProd.description}
                      onChange={(e) => setNewProd({...newProd, description: e.target.value})}
                      placeholder="A magnificent jewel crafted with classic engravings and intense ruby red tones..."
                      rows={3}
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:col-span-2 py-3.5 border-t border-b border-zinc-200/60 my-2 select-none">
                    <label className="flex items-center space-x-2 font-mono tracking-widest text-[#0a0a0a] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProd.featured}
                        onChange={(e) => setNewProd({...newProd, featured: e.target.checked})}
                        className="rounded-xs text-[#1a6b5c] focus:ring-[#1a6b5c] cursor-pointer"
                      />
                      <span>Is Featured</span>
                    </label>

                    <label className="flex items-center space-x-2 font-mono tracking-widest text-[#0a0a0a] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProd.bestseller}
                        onChange={(e) => setNewProd({...newProd, bestseller: e.target.checked})}
                        className="rounded-xs text-[#1a6b5c] focus:ring-[#1a6b5c] cursor-pointer"
                      />
                      <span>Is Bestseller</span>
                    </label>

                    <label className="flex items-center space-x-2 font-mono tracking-widest text-[#0a0a0a] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProd.inStock}
                        onChange={(e) => setNewProd({...newProd, inStock: e.target.checked})}
                        className="rounded-xs text-[#1a6b5c] focus:ring-[#1a6b5c] cursor-pointer"
                      />
                      <span>In Stock</span>
                    </label>

                    <div className="flex items-center space-x-2">
                      <label className="font-mono text-[#666] font-semibold whitespace-nowrap">Quantity:</label>
                      <input
                        type="number"
                        min="0"
                        value={newProd.stockQuantity !== undefined ? newProd.stockQuantity : 10}
                        onChange={(e) => setNewProd({...newProd, stockQuantity: Number(e.target.value)})}
                        className="w-20 p-2 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal text-center"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1a6b5c] hover:bg-[#1a6b5c]/90 text-white font-semibold py-3 flex items-center justify-center space-x-2 rounded-xs uppercase tracking-widest text-xs select-none cursor-pointer pointer-events-auto transition-colors"
                    >
                      <Plus size={14} />
                      <span>Release & Publish Masterpiece</span>
                    </button>
                  </div>
                </form>
              </details>

              {/* Published Items List */}
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-medium text-zinc-900 uppercase tracking-wider pl-1 border-l-2 border-[#1a6b5c]">
                  Currently Showcased Pieces ({dbActive ? dbProducts.length : localProducts.length} items)
                </h4>

                <div className="divide-y divide-zinc-100 max-h-[500px] overflow-y-auto pr-2 border border-zinc-200/50 rounded-sm">
                  {(dbActive ? dbProducts : localProducts).map((prod) => (
                    <div key={prod.id} className="flex items-center justify-between py-4.5 px-4 bg-white hover:bg-zinc-50 transition-colors select-none">
                      <div className="flex items-center space-x-4">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 object-cover border border-neutral-200 rounded-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-serif text-sm font-semibold text-zinc-900 leading-tight">{prod.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            {prod.category} • {prod.sku} • ₹{prod.price.toLocaleString('en-IN')}
                          </p>
                          {prod.inStock ? (
                            <span className="inline-block text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full mt-1.5 font-semibold bg-emerald-50 text-emerald-800">
                              IN STOCK
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1 mt-1.5 animate-pulse">
                              <span className="inline-block text-[8.5px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                OUT OF STOCK
                              </span>
                              <span className="inline-block text-[8.5px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                DELISTED
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <button
                          id={`admin-relist-toggle-${prod.id}`}
                          onClick={() => handleToggleProductStock(prod.id, prod.inStock, prod.name)}
                          disabled={loading}
                          className={`text-[9.5px] font-mono uppercase tracking-wider px-3 py-1.5 border rounded-xs transition-all pointer-events-auto cursor-pointer font-bold ${
                            prod.inStock
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {prod.inStock ? 'Delist' : 'Relist Instantly'}
                        </button>

                        <button
                          onClick={() => handleEditProductClick(prod)}
                          className="p-2.5 rounded-full bg-amber-50/70 hover:bg-amber-100 text-amber-700 border border-amber-205 transition-colors pointer-events-auto cursor-pointer flex items-center justify-center"
                          title="Edit Masterpiece"
                        >
                          <Edit size={13} />
                        </button>

                        {dbActive ? (
                          <button
                            onClick={() => handleDelistProduct(prod.id, prod.name)}
                            disabled={loading}
                            className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 hover:border-red-300 transition-colors pointer-events-auto cursor-pointer"
                            title="Delete Masterpiece Permanently"
                          >
                            <Trash2 size={13} />
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-400 font-medium uppercase tracking-wider">Static template</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDER ORCHESTRATION PANEL */}
          {activeSubTab === 'orders' && (
            <div className="space-y-8 animate-fade-in font-sans">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-serif text-2xl text-zinc-900 font-light uppercase tracking-wide">Secure Order Orchestrated Registry</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Insured shipping, courier tracking details and order workflow management from Supabase database.</p>
              </div>

              {!dbActive ? (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-sm text-amber-900 text-xs flex items-center space-x-2 font-mono">
                  <AlertCircle size={14} className="text-amber-600" />
                  <span>Configure SQL Tables on Supabase first to view live client checkouts and manage tracking states!</span>
                </div>
              ) : !dbOrders ? (
                <div className="p-4 text-zinc-500 text-xs font-mono">
                  Loading orders data...
                </div>
              ) : dbOrders.length === 0 ? (
                <div className="text-center py-16 border rounded-sm bg-zinc-50 border-neutral-200 text-zinc-400 font-mono space-y-2">
                  <ShoppingBag size={32} className="mx-auto" />
                  <p className="text-xs">No customer checkouts recorded yet on this Supabase project.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-zinc-200 rounded-md shadow-xs bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a6b5c] text-white text-[11px] font-mono tracking-wider uppercase">
                        <th className="p-3 border-b border-zinc-200">Order ID</th>
                        <th className="p-3 border-b border-zinc-200">Customer Name</th>
                        <th className="p-3 border-b border-zinc-200">Email</th>
                        <th className="p-3 border-b border-zinc-200">Amount</th>
                        <th className="p-3 border-b border-zinc-200">Status</th>
                        <th className="p-3 border-b border-zinc-200">Date</th>
                        <th className="p-3 border-b border-zinc-200 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                      {dbOrders.map((order, index) => (
                        <tr 
                          key={order.orderNumber || index}
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-neutral-50 transition-colors duration-150`}
                        >
                          <td className="p-3 font-mono font-bold text-[#1a6b5c] tracking-tight">
                            {order.orderNumber || 'N/A'}
                          </td>
                          <td className="p-3 font-serif font-semibold text-zinc-900">
                            {order.customerInfo?.firstName || ''} {order.customerInfo?.lastName || ''}
                          </td>
                          <td className="p-3 text-zinc-500 font-mono">
                            {order.customerInfo?.email || 'N/A'}
                          </td>
                          <td className="p-3 font-mono font-bold text-zinc-900">
                            ₹{order.total?.toLocaleString('en-IN') || '0'}
                          </td>
                          <td className="p-3">
                            <select
                              value={order.status || 'Placed'}
                              onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
                              className="p-1 px-2.5 rounded-xs border border-[#1a6b5c]/30 text-[#1a6b5c] bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] cursor-pointer text-[11px] font-sans"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Crafting">Crafting</option>
                              <option value="Quality Check">Quality Check</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-zinc-500 font-mono">
                            {order.date || 'N/A'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => viewOrderDetails(order)}
                              className="px-3 py-1.5 bg-[#1a6b5c] hover:bg-[#1a6b5c]/90 text-white font-mono tracking-wider font-semibold rounded-xs uppercase text-[9px] pointer-events-auto cursor-pointer transition-colors duration-150"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* LIVE INTERACTIONS PANEL */}
          {activeSubTab === 'interactions' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-serif text-2xl text-zinc-900 font-light uppercase tracking-wide">Dynamic Interaction Telemetry</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Live customer cart drafts and curator wishlists synchronizing directly over your Supabase project.</p>
              </div>

              {!dbActive ? (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-sm text-amber-900 text-xs flex items-center space-x-2 font-mono">
                  <AlertCircle size={14} className="text-amber-600" />
                  <span>Configure SQL Tables on Supabase first to sync live guest cart draft cycles!</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs select-none">
                  
                  {/* Cart sync column */}
                  <div className="border border-zinc-200 p-4 rounded-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6b5c] border-b border-[#1a6b5c]/10 pb-2 flex items-center space-x-1">
                      <ShoppingBag size={13} />
                      <span>Live Synced Carts ({dbCartItems.length})</span>
                    </h4>

                    {dbCartItems.length === 0 ? (
                      <p className="text-[11px] text-zinc-400 py-6 text-center italic">No checkout carts currently pending on Supabase.</p>
                    ) : (
                      <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
                        {dbCartItems.map((cartItem) => (
                          <div key={cartItem.id} className="bg-neutral-50 border p-2.5 rounded-sm flex items-start space-x-2.5">
                            <img src={cartItem.product.image} className="w-10 h-10 object-cover border border-neutral-200" referrerPolicy="no-referrer" />
                            <div className="leading-tight space-y-1">
                              <p className="font-semibold text-zinc-900 font-serif leading-none">{cartItem.product.name}</p>
                              <p className="text-[9px] text-[#666] tracking-tight">{cartItem.selectedMetal} ({cartItem.quantity} pcs)</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Wishlist sync column */}
                  <div className="border border-zinc-200 p-4 rounded-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6b5c] border-b border-[#1a6b5c]/10 pb-2 flex items-center space-x-1">
                      <Heart size={13} />
                      <span>Curated Wishlists ({dbWishlisted.length})</span>
                    </h4>

                    {dbWishlisted.length === 0 ? (
                      <p className="text-[11px] text-zinc-400 py-6 text-center italic">No curator wishlists currently active on Supabase.</p>
                    ) : (
                      <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
                        {dbWishlisted.map((wishProd, i) => (
                          <div key={wishProd.id + '-' + i} className="bg-neutral-50 border p-2.5 rounded-sm flex items-start space-x-2.5">
                            <img src={wishProd.image} className="w-10 h-10 object-cover border border-neutral-200" referrerPolicy="no-referrer" />
                            <div className="leading-tight space-y-1">
                              <p className="font-semibold text-zinc-900 font-serif leading-none">{wishProd.name}</p>
                              <p className="text-[9px] text-[#666] tracking-tight">{wishProd.category} • SKU: {wishProd.sku}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* BESPOKE INQUIRIES PANEL */}
          {activeSubTab === 'inquiries' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-zinc-100 pb-4">
                <h3 className="font-serif text-2xl text-zinc-900 font-light uppercase tracking-wide">Bespoke Royal Inquiries ({dbBespokeInquiries.length})</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Live customer customization requirements, gemstone coordinates, and budget scales synchronizing directly from contact wires.</p>
              </div>

              {dbBespokeInquiries.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-200 bg-neutral-50/50 rounded-sm">
                  <p className="text-zinc-400 italic text-sm">No bespoke concierge wires received yet.</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Test your contact desk page to generate a real-time record in Supabase.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {dbBespokeInquiries.map((inq) => (
                    <div key={inq.id} className="border border-zinc-200 rounded-sm overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                      
                      {/* Top Bar of Inquiry */}
                      <div className="bg-[#f5f0eb]/30 border-b border-zinc-100 p-4 sm:px-6 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
                        <div>
                          <p className="text-[10px] text-[#1a6b5c] uppercase font-bold tracking-wider">PATRON ACCOUNT CONCIERGE</p>
                          <h4 className="font-serif text-base font-bold text-zinc-900 leading-tight mt-1">{inq.fullName}</h4>
                        </div>
                        <div className="text-right text-[10px] text-zinc-500 font-sans font-light">
                          <p className="font-mono">{new Date(inq.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="mt-1">ID Ref: #INQ-{inq.id}</p>
                        </div>
                      </div>

                      {/* Content details and narrative */}
                      <div className="p-4 sm:p-6 space-y-6 text-xs select-none">
                        
                        {/* Custom Requirements Specs Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-3 pb-4 border-b border-dashed border-zinc-200">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Preferred Metal</span>
                            <span className="font-medium text-zinc-800 text-[11px]">{inq.preferredMetal}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Preferred Gemstone</span>
                            <span className="font-medium text-zinc-800 text-[11px]">{inq.preferredGemstone}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Budget Scale</span>
                            <span className="font-bold text-[#1a6b5c] text-[11px]">{inq.budgetRange}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Intended Timeline</span>
                            <span className="font-medium text-zinc-800 text-[11px]">{inq.timeline}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Consultation Mode</span>
                            <span className="font-bold text-zinc-800 text-[11px] bg-[#f5f0eb] px-1.5 py-0.5 border rounded-xs">{inq.consultationType}</span>
                          </div>
                        </div>

                        {/* Patron coordinates card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] bg-neutral-50 px-4 py-2.5 rounded-xs border border-neutral-100">
                          <div>
                            <span className="font-semibold text-zinc-700">Contact Email: </span>
                            <a href={`mailto:${inq.email}`} className="text-[#1a6b5c] underline font-mono">{inq.email}</a>
                          </div>
                          {inq.phone && (
                            <div>
                              <span className="font-semibold text-zinc-700">Mobile Coordinates: </span>
                              <span className="font-mono text-zinc-800">{inq.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Exquisite Narrative */}
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Bespoke Design Context</span>
                          <div className="bg-[#f5f0eb]/20 p-4 border-l-2 border-[#1a6b5c] rounded-xs font-serif text-[13px] text-zinc-800 italic leading-relaxed whitespace-pre-line">
                            "{inq.message}"
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCHEMA CONFIGURATION COPY PASTE GUIDE */}
          {activeSubTab === 'schema' && (
            <div className="space-y-6 animate-fade-in text-xs font-mono select-none">
              <div className="border-b border-zinc-100 pb-4 font-sans">
                <h3 className="font-serif text-2xl text-zinc-900 font-light uppercase tracking-wide">SQL Database Table Schema Setup</h3>
                <p className="text-xs text-neutral-500 mt-1">Deploy these PostgreSQL declarations to quickly set up your project tables in the Supabase workspace.</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-4 text-xs font-light space-y-3 font-sans uppercase tracking-widest text-[9px] text-[#1a6b5c] font-bold">
                <p>Steps to synchronize Database Structure in 5 seconds:</p>
                <ol className="list-decimal pl-5 space-y-2 uppercase tracking-wide normal-case text-zinc-600 font-normal text-xs font-sans">
                  <li>Log in to your Supabase Dashboard (<a href="https://supabase.com" target="_blank" className="text-[#1a6b5c] font-bold underline inline-flex items-center space-x-1">Supabase Console <ExternalLink size={10} className="ml-0.5" /></a>)</li>
                  <li>Click on your project <strong>tvftfzeroallfzzzfvmi</strong></li>
                  <li>Navigate to the left-hand navigation and select <strong>SQL Editor</strong></li>
                  <li>Click &ldquo;New Query&rdquo;, paste the schema script block shown below and click <strong>Run</strong></li>
                  <li>That is it! Return here and enjoy a completely functional dynamic jewelry boutique.</li>
                </ol>
              </div>

              <div className="relative">
                <button
                  onClick={handleCopySchema}
                  className="absolute right-4.5 top-3.5 bg-zinc-900 text-white font-semibold text-[10px] uppercase tracking-widest py-2 px-4 rounded hover:bg-zinc-800 transition shadow cursor-pointer flex items-center space-x-1.5 font-sans pointer-events-auto"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <FileCode size={12} />}
                  <span>{copied ? 'Copied script!' : 'Copy SQL Script'}</span>
                </button>
                <pre className="bg-[#0c0f12] text-[#f5f0eb] p-5 pt-14 rounded-sm text-[11.5px] font-mono leading-relaxed overflow-x-auto max-h-[400px] border border-zinc-800 select-all tracking-normal">
                  {SQL_SCHEMA_GUIDE}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* SECURE ORDER DETAILS ORCHESTRATION MODAL */}
        {selectedOrder && showOrderModal && (
          <div id="order-details-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 select-none animate-fade-in pointer-events-auto font-sans">
            <div className="bg-white rounded-sm border border-zinc-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-6 space-y-6">
              
              {/* Modal header */}
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                <h3 className="font-serif text-lg font-medium tracking-wider uppercase text-zinc-900 border-l-2 border-[#1a6b5c] pl-2">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-neutral-100 transition cursor-pointer pointer-events-auto"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6 text-xs text-zinc-800">
                
                {/* 1. Customer Profiles & Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-zinc-100 pb-4">
                  <div>
                    <h4 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-1 uppercase tracking-wider font-mono text-[10px] text-[#1a6b5c]">Customer Profile</h4>
                    <p className="mt-2 text-sm font-serif font-bold text-zinc-800">
                      {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}
                    </p>
                    <p className="text-zinc-500 font-mono mt-1">{selectedOrder.customerInfo?.email}</p>
                    <p className="text-zinc-500 font-mono">{selectedOrder.customerInfo?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-1 uppercase tracking-wider font-mono text-[10px] text-[#1a6b5c]">Shipping Address</h4>
                    <p className="mt-2 text-zinc-700">{selectedOrder.customerInfo?.address}</p>
                    <p className="text-zinc-700">
                      {selectedOrder.customerInfo?.city}, {selectedOrder.customerInfo?.zipCode}
                    </p>
                    <p className="text-zinc-700 font-semibold">{selectedOrder.customerInfo?.country}</p>
                  </div>
                </div>

                {/* 2. Order Line Items Checklist */}
                <div>
                  <h4 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-1.5 uppercase tracking-wider font-mono text-[10px] text-[#1a6b5c]">Line Items & Selection Details</h4>
                  <div className="divide-y divide-zinc-100 max-h-[180px] overflow-y-auto mt-2 space-y-2 pr-1">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between py-2 items-center">
                        <div className="pr-4">
                          <p className="font-serif font-bold text-zinc-900 text-sm">
                            {item.product?.name || 'Artisan Jewel'} <span className="font-mono text-xs text-[#1a6b5c] font-bold">x{item.quantity}</span>
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-normal mt-0.5">
                            Finish: {item.selectedMetal} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                          </p>
                          {item.engraving && (
                            <p className="text-[10px] text-[#1a6b5c] italic mt-1 font-mono">
                              Engraving: &ldquo;{item.engraving}&rdquo;
                            </p>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-zinc-800">
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Pricing Settlement Grid */}
                <div className="bg-neutral-50 p-4 rounded-sm border border-neutral-100 font-mono space-y-1.5 text-right flex flex-col items-end">
                  <div className="flex justify-between w-64 text-[10px] text-neutral-500">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between w-64 text-[10px] text-neutral-500">
                    <span>Shipping Guard:</span>
                    <span>₹{selectedOrder.shipping?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between w-64 text-[10px] text-neutral-500">
                    <span>GST / Tax:</span>
                    <span>₹{selectedOrder.tax?.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between w-64 text-[10px] text-emerald-600 font-semibold">
                      <span>Promo Discount:</span>
                      <span>-₹{selectedOrder.discount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between w-64 text-sm font-bold border-t border-neutral-200 pt-1.5 text-[#1a6b5c] mt-1">
                    <span>TOTAL:</span>
                    <span>₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 4. Payment Settlement & Dynamic Status controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                  <div className="space-y-1 font-mono text-[10px] text-zinc-500">
                    <p className="font-bold text-zinc-700 uppercase tracking-wider text-[9px]">Payment Method (Secure checkout)</p>
                    <p className="text-zinc-800 font-semibold uppercase mt-1">Cardholder: {selectedOrder.paymentInfo?.cardholderName || 'Signature auth'}</p>
                    <p className="text-zinc-600">Card Masked: {selectedOrder.paymentInfo?.cardNumberMasked || '•••• •••• •••• 1928'}</p>
                    {selectedOrder.utrNumber && (
                      <p className="text-[#1a6b5c] font-semibold font-mono text-[11px]">UPI UTR ID: {selectedOrder.utrNumber}</p>
                    )}
                    <p className="text-zinc-400">Transaction Status: Fully captured & settled</p>
                  </div>
                  <div className="flex flex-col justify-center items-end space-y-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Courier Status Workflow</span>
                    <select
                      value={selectedOrder.status || 'Placed'}
                      onChange={(e) => {
                        updateOrderStatus(selectedOrder.orderNumber, e.target.value);
                        setSelectedOrder(prev => prev ? { ...prev, status: e.target.value } : null);
                      }}
                      className="bg-white border border-[#1a6b5c]/30 rounded-xs py-1.5 px-3 font-sans font-semibold text-xs text-[#1a6b5c] tracking-wide focus:ring-1 focus:ring-[#1a6b5c] cursor-pointer"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Crafting">Crafting</option>
                      <option value="Quality Check">Quality Check</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-5 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-xs uppercase tracking-widest text-[#666] font-semibold font-mono text-[10px] cursor-pointer pointer-events-auto transition-colors"
                >
                  Close Registry Details
                </button>
              </div>

            </div>
          </div>
        )}

        {/* EXQUISITE EDIT MASTERPIECE MODAL */}
        {editingProduct && (
          <div id="edit-product-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 select-none animate-fade-in pointer-events-auto">
            <div className="bg-white rounded-sm border border-zinc-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-6 space-y-6">
              
              {/* Modal header */}
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                <h3 className="font-serif text-lg font-medium tracking-wider uppercase text-zinc-900 border-l-2 border-[#1a6b5c] pl-2">
                  Edit Masterpiece: {editingProduct.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-neutral-100 transition cursor-pointer pointer-events-auto"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal form */}
              <form onSubmit={handleUpdateProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-zinc-800 uppercase font-mono tracking-widest text-[9.5px]">
                <div>
                  <label className="block text-[#666] mb-1 font-semibold">Unique Product ID (Read-only)</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={editingProduct.id}
                    className="w-full p-2.5 border border-zinc-200 bg-neutral-100 rounded-xs text-xs font-mono tracking-normal text-zinc-500 cursor-not-allowed select-all"
                  />
                </div>

                <div>
                  <label className="block text-[#666] mb-1 font-semibold">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monica Cushion Cut Royal Ruby Ring"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                  />
                </div>

                <div>
                  <label className="block text-[#666] mb-1 font-semibold">Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal"
                  />
                </div>

                <div>
                  <label className="block text-[#666] mb-1 font-semibold">SKU identifier (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate SKU"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                  />
                </div>

                <div>
                  <label className="block text-[#666] mb-1 font-semibold">Collection Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value as any})}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Pendants">Pendants</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bangles">Bangles</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Nosepins">Nosepins</option>
                  </select>
                </div>

                {/* PRODUCT IMAGES SECTION */}
                <div className="sm:col-span-2 border border-zinc-200 p-4 bg-zinc-50/50 rounded-sm space-y-4 font-sans">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-150 pb-2">
                    <label className="block text-[#1a6b5c] font-bold tracking-wider text-xs font-mono uppercase">
                      PRODUCT IMAGES (Max 4)
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      JPG, PNG, WEBP • Max 5MB each
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                    {[0, 1, 2, 3].map((index) => {
                      const preview = editPreviews[index];
                      const isMain = index === 0;

                      return (
                        <div key={index} className="flex flex-col space-y-1">
                          <div
                            onClick={() => {
                              if (!preview) {
                                document.getElementById(`image-edit-input-${index}`)?.click();
                              }
                            }}
                            className={`relative aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 text-center transition duration-200 overflow-hidden bg-white group shadow-xs select-none ${
                              preview 
                                ? 'border-zinc-200' 
                                : 'border-[#1a6b5c]/70 hover:border-[#1a6b5c] hover:bg-neutral-50 cursor-pointer'
                            }`}
                            style={{ minHeight: '110px' }}
                          >
                            {preview ? (
                              <>
                                <img 
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImageAt(index, true);
                                  }}
                                  className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold pointer-events-auto cursor-pointer shadow-md border border-white transition"
                                  title="Remove Image"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center space-y-1 select-none pointer-events-none">
                                <span className="text-2xl text-[#1a6b5c] group-hover:scale-110 transition duration-300">
                                  +
                                </span>
                                <span className="font-semibold text-zinc-600 text-[10px]">
                                  Upload
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <input
                            id={`image-edit-input-${index}`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              handleImageFileSelect(file, index, true);
                            }}
                          />

                          <div className="text-center">
                            <span className={`text-[9px] font-bold uppercase tracking-wider font-mono ${
                              isMain ? 'text-[#1a6b5c]' : 'text-zinc-400'
                            }`}>
                              {isMain ? 'Main Image' : `Additional ${index}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {editUploadState.uploading && (
                    <div className="text-[#1a6b5c] text-[10px] font-semibold flex flex-col items-center space-y-1 font-mono pt-1">
                      <span className="animate-pulse">⏳ Processing & uploading images ({editUploadState.progress}%)...</span>
                      <div className="w-48 bg-neutral-200 rounded-full h-1 overflow-hidden mt-1 text-mono">
                        <div
                          className="bg-[#1a6b5c] h-1 rounded-full transition-all duration-350"
                          style={{ width: `${editUploadState.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {editUploadState.success && (
                    <div className="text-emerald-700 text-[10px] font-semibold flex items-center justify-center space-x-1.5 py-1 font-mono">
                      <span>✅</span>
                      <span>All product images uploaded successfully!</span>
                    </div>
                  )}

                  {editUploadState.error && (
                    <div className="text-red-600 text-[10px] font-semibold flex items-center justify-center space-x-1.5 py-1 font-mono">
                      <span>❌</span>
                      <span>{editUploadState.error}</span>
                    </div>
                  )}

                  {/* URL Field - auto-filled OR manual */}
                  <div className="mt-3">
                    <label className="block text-[#666] mb-1 font-semibold">SPLENDID IMAGE URL (auto-filled after upload)</label>
                    <input
                      type="url"
                      placeholder="Auto-filled after upload or paste URL manually"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                      className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#666] mb-1 font-semibold">Materials Accents (Comma-separated list)</label>
                  <input
                    type="text"
                    value={editMaterialsInput}
                    onChange={(e) => setEditMaterialsInput(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#666] mb-1 font-semibold">Atelier Details Checklist (Comma-separated list)</label>
                  <input
                    type="text"
                    value={editDetailsInput}
                    onChange={(e) => setEditDetailsInput(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#666] mb-1 font-semibold">Exquisite Narrative / Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={2}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal normal-case"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:col-span-2 py-3 border-t border-b border-zinc-200/60 my-1">
                  <label className="flex items-center space-x-2 font-mono tracking-widest text-[#0a0a0a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured}
                      onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})}
                      className="rounded-xs text-[#1a6b5c] focus:ring-[#1a6b5c] cursor-pointer"
                    />
                    <span>Is Featured</span>
                  </label>

                  <label className="flex items-center space-x-2 font-mono tracking-widest text-[#0a0a0a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.bestseller}
                      onChange={(e) => setEditingProduct({...editingProduct, bestseller: e.target.checked})}
                      className="rounded-xs text-[#1a6b5c] focus:ring-[#1a6b5c] cursor-pointer"
                    />
                    <span>Is Bestseller</span>
                  </label>

                  <label className="flex items-center space-x-2 font-mono tracking-widest text-[#0a0a0a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                      className="rounded-xs text-[#1a6b5c] focus:ring-[#1a6b5c] cursor-pointer"
                    />
                    <span>In Stock</span>
                  </label>

                  <div className="flex items-center space-x-2">
                    <label className="font-mono text-[#666] font-semibold whitespace-nowrap">Quantity:</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stockQuantity !== undefined ? editingProduct.stockQuantity : 10}
                      onChange={(e) => setEditingProduct({...editingProduct, stockQuantity: Number(e.target.value)})}
                      className="w-20 p-2 border border-zinc-200 bg-white rounded-xs focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] text-xs font-mono tracking-normal text-center"
                    />
                  </div>
                </div>

                {/* Save/Cancel controls */}
                <div className="sm:col-span-2 flex space-x-3.5 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#1a6b5c] hover:bg-[#1a6b5c]/90 text-white font-semibold py-3 flex items-center justify-center space-x-2 rounded-xs uppercase tracking-widest text-xs cursor-pointer inline-block"
                  >
                    {loading ? 'Transmitting Changes...' : 'Save & Deploy Updates'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-6 bg-[#eae9e6] hover:bg-[#dfddd9] border border-zinc-200 text-zinc-700 py-3 uppercase tracking-widest text-xs rounded-xs cursor-pointer inline-block font-bold"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
