import { useState, useEffect, useMemo } from 'react';
import { MenuItem, CartItem, Order, TableInfo, SelectedOption } from './types';
import { INITIAL_MENU_ITEMS, STORE_INFO } from './data/menuData';
import { sendOrderToGAS } from './utils/gasHelper';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { ItemOptionModal } from './components/ItemOptionModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmModal } from './components/OrderConfirmModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TableSelectorModal } from './components/TableSelectorModal';
import { GasGuideModal } from './components/GasGuideModal';
import { CallWaiterModal } from './components/CallWaiterModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { Utensils, AlertCircle, MapPin, Phone, Bike, Sparkles } from 'lucide-react';

export default function App() {
  // 1. Table Identification State (URL param ?table= or manual)
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    number: '未指定桌號',
    source: 'default',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');

    if (tableParam && tableParam.trim() !== '') {
      setTableInfo({
        number: tableParam.trim().toUpperCase(),
        source: 'url',
      });
    } else {
      // Check localStorage for saved table preference
      const savedTable = localStorage.getItem('qr_table_number');
      if (savedTable) {
        setTableInfo({
          number: savedTable,
          source: 'manual',
        });
      }
    }
  }, []);

  const handleSelectTable = (tableNumber: string) => {
    setTableInfo({
      number: tableNumber,
      source: 'manual',
    });
    localStorage.setItem('qr_table_number', tableNumber);
  };

  // 2. Menu Search & Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMenuItems = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: INITIAL_MENU_ITEMS.length };
    INITIAL_MENU_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // 3. Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('qr_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderNote, setOrderNote] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('qr_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Modals state
  const [optionModalItem, setOptionModalItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);
  const [isCallWaiterModalOpen, setIsCallWaiterModalOpen] = useState<boolean>(false);
  const [isOrderHistoryModalOpen, setIsOrderHistoryModalOpen] = useState<boolean>(false);

  // Active & History Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('qr_orders_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // GAS API URL setting
  const [gasUrl, setGasUrl] = useState<string>(() => {
    return localStorage.getItem('qr_gas_api_url') || '';
  });

  const handleSaveGasUrl = (url: string) => {
    setGasUrl(url);
    localStorage.setItem('qr_gas_api_url', url);
  };

  // Cart operations
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    options: SelectedOption[],
    specialInstruction: string
  ) => {
    // Generate unique ID based on item ID + sorted option IDs
    const optionKey = options
      .map((o) => `${o.groupId}:${o.optionId}`)
      .sort()
      .join('|');
    const cartItemId = `${item.id}_${optionKey}_${specialInstruction}`;

    const optionsPrice = options.reduce((acc, curr) => acc + curr.price, 0);
    const itemTotal = (item.price + optionsPrice) * quantity;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        const newTotal = (item.price + optionsPrice) * newQty;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          itemTotal: newTotal,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem: item,
            quantity,
            selectedOptions: options,
            itemTotal,
            specialInstruction,
          },
        ];
      }
    });
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart(item, 1, [], '');
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((ci) => {
        if (ci.cartItemId === cartItemId) {
          const unitPrice = ci.itemTotal / ci.quantity;
          return {
            ...ci,
            quantity: newQty,
            itemTotal: unitPrice * newQty,
          };
        }
        return ci;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Cart Quantity Helper per Item
  const getCartQuantityForItem = (itemId: string) => {
    return cartItems
      .filter((ci) => ci.menuItem.id === itemId)
      .reduce((acc, ci) => acc + ci.quantity, 0);
  };

  // Checkout submission
  const handleConfirmOrder = async (paymentMethod: string) => {
    setIsSubmittingOrder(true);

    const now = new Date();
    const orderId = `ORD-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const totalAmount = cartItems.reduce((acc, ci) => acc + ci.itemTotal, 0);

    const newOrder: Order = {
      orderId,
      tableNumber: tableInfo.number,
      items: [...cartItems],
      totalAmount,
      note: orderNote,
      paymentMethod,
      status: 'received',
      createdAt: now.toLocaleString('zh-TW', { hour12: false }),
    };

    // Send to Google Apps Script
    const result = await sendOrderToGAS(newOrder, gasUrl);
    newOrder.gasSubmitted = result.success;

    // Update history orders
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('qr_orders_history', JSON.stringify(updatedOrders));

    setLastSubmittedOrder(newOrder);

    // Clear cart & reset modal
    setCartItems([]);
    setOrderNote('');
    setIsSubmittingOrder(false);
    setIsConfirmModalOpen(false);
    setIsCartOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-gray-800 pb-24 font-sans antialiased">
      {/* 1. Header with Table Badge & Toolbar */}
      <Header
        tableNumber={tableInfo.number}
        tableSource={tableInfo.source}
        onOpenTableSelector={() => setIsTableModalOpen(true)}
        onOpenCallWaiter={() => setIsCallWaiterModalOpen(true)}
        onOpenGasSettings={() => setIsGasModalOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        orderCount={orders.length}
      />

      {/* 2. Category Nav Tabs */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Table Warning Banner if not set via URL */}
        {tableInfo.number === '未指定桌號' && (
          <div className="mb-6 bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-3.5 rounded-2xl shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>注意：目前未帶入桌號，請點擊右側設定桌號，以免無法順利送餐。</span>
            </div>
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-2xs"
            >
              設定桌號
            </button>
          </div>
        )}

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            <span>
              {selectedCategory === 'all'
                ? '全部精選菜單'
                : INITIAL_MENU_ITEMS.find((i) => i.category === selectedCategory)
                    ?.categoryName || '菜單品項'}
            </span>
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            共 {filteredMenuItems.length} 個品項
          </span>
        </div>

        {/* Menu Items Grid */}
        {filteredMenuItems.length === 0 ? (
          <div className="py-16 text-center text-gray-400 bg-white rounded-3xl border border-amber-100 p-8 shadow-xs">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-bold text-gray-700 text-base">找不到符合條件的餐點</p>
            <p className="text-xs text-gray-400 mt-1">請嘗試搜尋其他關鍵字或切換分類。</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl hover:bg-amber-200 transition-all"
            >
              清除搜尋與過濾條件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onOpenOptions={(selected) => setOptionModalItem(selected)}
                onQuickAdd={handleQuickAdd}
                cartQuantity={getCartQuantityForItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Restaurant Brand Info Card (Matching printed menu bottom) */}
        <section className="mt-10 rounded-2xl bg-gradient-to-br from-amber-100/70 to-orange-100/50 border border-amber-200/80 p-5 shadow-xs text-amber-950">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-300/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center font-black font-serif text-xl shadow-xs">
                木
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <span>{STORE_INFO.name}</span>
                  <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-medium">熟手作成</span>
                </h3>
                <p className="text-xs text-amber-800/90 mt-0.5 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {STORE_INFO.slogan}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start md:self-auto bg-amber-200/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900">
              <Bike className="w-4 h-4 text-amber-700" />
              <span>{STORE_INFO.deliveryNotice}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs text-gray-700">
            <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-100">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>門市地址：<strong className="text-gray-900">{STORE_INFO.address}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-100">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>訂購電話：<strong className="text-gray-900">{STORE_INFO.phone}</strong> (大量訂購歡迎預約)</span>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modals */}
      {/* 1. Item Option Customization Modal */}
      <ItemOptionModal
        item={optionModalItem}
        onClose={() => setOptionModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        tableNumber={tableInfo.number}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderNote={orderNote}
        setOrderNote={setOrderNote}
        onCheckout={() => {
          if (tableInfo.number === '未指定桌號') {
            setIsTableModalOpen(true);
          } else {
            setIsConfirmModalOpen(true);
          }
        }}
      />

      {/* 3. Order Confirmation Modal */}
      <OrderConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        cartItems={cartItems}
        tableNumber={tableInfo.number}
        orderNote={orderNote}
        onConfirmOrder={handleConfirmOrder}
        isSubmitting={isSubmittingOrder}
      />

      {/* 4. Order Success Thank You Modal */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        order={lastSubmittedOrder}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setLastSubmittedOrder(null);
        }}
        onOpenOrderHistory={() => {
          setIsSuccessModalOpen(false);
          setIsOrderHistoryModalOpen(true);
        }}
        onOpenCallWaiter={() => {
          setIsSuccessModalOpen(false);
          setIsCallWaiterModalOpen(true);
        }}
      />

      {/* 5. Table Switcher & QR Code Simulator Modal */}
      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        currentTable={tableInfo.number}
        tableSource={tableInfo.source}
        onSelectTable={handleSelectTable}
      />

      {/* 6. Google Apps Script Setup & Guide Modal */}
      <GasGuideModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        gasUrl={gasUrl}
        onSaveGasUrl={handleSaveGasUrl}
      />

      {/* 7. Call Waiter Service Modal */}
      <CallWaiterModal
        isOpen={isCallWaiterModalOpen}
        onClose={() => setIsCallWaiterModalOpen(false)}
        tableNumber={tableInfo.number}
      />

      {/* 8. Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryModalOpen}
        onClose={() => setIsOrderHistoryModalOpen(false)}
        orders={orders}
      />
    </div>
  );
}
