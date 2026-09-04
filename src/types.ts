export interface CustomizationGroup {
  id: string;
  name: string; // e.g. "辣度", "加料", "冰塊/甜度"
  required: boolean;
  maxSelect?: number; // default 1 if required
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

export type MenuCategoryType =
  | 'curry_fried'
  | 'curry'
  | 'sides'
  | 'veggie'
  | 'soup'
  | string;

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategoryType;
  categoryName: string;
  price: number;
  description: string;
  image: string;
  tags?: string[]; // e.g. "熱銷", "廚師推薦", "辣", "全素"
  customizationGroups?: CustomizationGroup[];
}

export interface SelectedOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique string for same item with different options
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  itemTotal: number;
  specialInstruction?: string;
}

export interface Order {
  orderId: string;
  tableNumber: string;
  items: CartItem[];
  totalAmount: number;
  note: string;
  paymentMethod: string;
  status: 'received' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  gasSubmitted?: boolean;
}

export interface TableInfo {
  number: string;
  source: 'url' | 'manual' | 'default';
}
