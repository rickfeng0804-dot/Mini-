import { MenuItem } from '../types';

export const CATEGORIES = [
  { id: 'all', name: '全部菜單', icon: 'Utensils' },
  { id: 'main', name: '精選主餐', icon: 'Beef' },
  { id: 'sides', name: '人氣小吃', icon: 'Popcorn' },
  { id: 'drinks', name: '特調飲品/甜點', icon: 'CupSoda' },
  { id: 'soup', name: '暖胃湯品', icon: 'Soup' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // 精選主餐 Main
  {
    id: 'm1',
    name: '招牌秘製牛肉麵',
    category: 'main',
    categoryName: '精選主餐',
    price: 190,
    description: '慢火熬煮8小時濃郁牛骨高湯，搭配軟嫩牛腱肉與Q彈手打麵條。',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    tags: ['熱銷', '廚師推薦', '招牌'],
    customizationGroups: [
      {
        id: 'spicy',
        name: '辣度選擇',
        required: true,
        options: [
          { id: 's0', name: '不辣', price: 0 },
          { id: 's1', name: '微辣', price: 0 },
          { id: 's2', name: '中辣', price: 0 },
          { id: 's3', name: '大辣', price: 0 },
        ],
      },
      {
        id: 'noodle',
        name: '麵條選擇',
        required: true,
        options: [
          { id: 'n1', name: '家常寬麵', price: 0 },
          { id: 'n2', name: '細麵', price: 0 },
          { id: 'n3', name: '拉麵', price: 0 },
        ],
      },
      {
        id: 'topping',
        name: '美味加料',
        required: false,
        maxSelect: 3,
        options: [
          { id: 't1', name: '加糖心蛋 (+15)', price: 15 },
          { id: 't2', name: '加牛肉 (+45)', price: 45 },
          { id: 't3', name: '加青菜 (+20)', price: 20 },
        ],
      },
    ],
  },
  {
    id: 'm2',
    name: '台式古早味滷肉飯定食',
    category: 'main',
    categoryName: '精選主餐',
    price: 145,
    description: '嚴選黑豬五花肉切丁慢火滷製，附手工酸菜、滷蛋、油豆腐與時菜。',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    tags: ['熱銷', '經典'],
    customizationGroups: [
      {
        id: 'rice',
        name: '飯量調整',
        required: true,
        options: [
          { id: 'r1', name: '正常飯量', price: 0 },
          { id: 'r2', name: '飯少', price: 0 },
          { id: 'r3', name: '加飯 (+15)', price: 15 },
        ],
      },
      {
        id: 'topping_lu',
        name: '升級配料',
        required: false,
        options: [
          { id: 'lt1', name: '多一粒滷蛋 (+15)', price: 15 },
          { id: 'lt2', name: '加香菜 (免費)', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'm3',
    name: '日式黃金炸豬排咖哩飯',
    category: 'main',
    categoryName: '精選主餐',
    price: 210,
    description: '外酥內嫩厚切大豬排，搭配甘甜香濃的日式水果咖哩醬汁。',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    tags: ['人氣', '飽足感'],
    customizationGroups: [
      {
        id: 'curry_spicy',
        name: '咖哩辣度',
        required: true,
        options: [
          { id: 'cs1', name: '甘口 (不辣)', price: 0 },
          { id: 'cs2', name: '辛口 (微辣)', price: 0 },
          { id: 'cs3', name: '激辛 (大辣)', price: 0 },
        ],
      },
      {
        id: 'curry_cheese',
        name: '起司加購',
        required: false,
        options: [
          { id: 'ch1', name: '炙燒起司片 (+25)', price: 25 },
        ],
      },
    ],
  },
  {
    id: 'm4',
    name: '泰式打拋豬肉飯 (附太陽蛋)',
    category: 'main',
    categoryName: '精選主餐',
    price: 170,
    description: '新鮮打拋葉與大火快炒豬絞肉，香辣開胃，搭配香濃流心半熟蛋。',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    tags: ['辛辣', '開胃'],
    customizationGroups: [
      {
        id: 'thai_spicy',
        name: '辣度選擇',
        required: true,
        options: [
          { id: 'ts1', name: '小辣', price: 0 },
          { id: 'ts2', name: '中辣 (道地)', price: 0 },
          { id: 'ts3', name: '大辣', price: 0 },
        ],
      },
      {
        id: 'egg_type',
        name: '蛋的熟度',
        required: true,
        options: [
          { id: 'et1', name: '半熟蛋 (流心)', price: 0 },
          { id: 'et2', name: '全熟蛋', price: 0 },
        ],
      },
    ],
  },

  // 人氣小吃 Sides
  {
    id: 's1',
    name: '酥炸台灣鹽酥雞',
    category: 'sides',
    categoryName: '人氣小吃',
    price: 85,
    description: '鮮嫩去骨雞腿肉秘製醃漬，搭配獨門香料與九層塔酥炸。',
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=600&q=80',
    tags: ['熱銷', '必點'],
    customizationGroups: [
      {
        id: 'seasoning',
        name: '調味選擇',
        required: true,
        options: [
          { id: 'se1', name: '胡椒鹽', price: 0 },
          { id: 'se2', name: '辣粉', price: 0 },
          { id: 'se3', name: '梅子粉', price: 0 },
        ],
      },
    ],
  },
  {
    id: 's2',
    name: '黃金香酥脆薯條',
    category: 'sides',
    categoryName: '人氣小吃',
    price: 65,
    description: '現點現炸的金黃美式波浪薯條，香脆不油膩。',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    tags: ['蛋素', '點心'],
    customizationGroups: [
      {
        id: 'sauce',
        name: '沾醬選擇',
        required: true,
        options: [
          { id: 'sa1', name: '蕃茄醬', price: 0 },
          { id: 'sa2', name: '蜂蜜芥末醬', price: 0 },
          { id: 'sa3', name: '起司濃醬 (+15)', price: 15 },
        ],
      },
    ],
  },
  {
    id: 's3',
    name: '手作手工紅油抄手 (6顆)',
    category: 'sides',
    categoryName: '人氣小吃',
    price: 90,
    description: '薄皮鮮肉餛飩，淋上特製麻辣紅油與花椒香醋，麻香四溢。',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
    tags: ['辛辣', '師傅手作'],
  },
  {
    id: 's4',
    name: '蒜泥蒜香燙時菜',
    category: 'sides',
    categoryName: '人氣小吃',
    price: 55,
    description: '當日新鮮蔬菜高湯川燙，淋上特調古早味蒜泥醬油。',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    tags: ['健康', '時令'],
  },

  // 特調飲品/甜點 Drinks & Desserts
  {
    id: 'd1',
    name: '黑糖珍珠鮮奶茶',
    category: 'drinks',
    categoryName: '特調飲品/甜點',
    price: 75,
    description: '手工手炒黑糖珍珠，搭配優質小農鮮乳與特選阿薩姆紅茶。',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600&q=80',
    tags: ['熱銷', '甜點飲品'],
    customizationGroups: [
      {
        id: 'ice',
        name: '冰塊選擇',
        required: true,
        options: [
          { id: 'i1', name: '正常冰', price: 0 },
          { id: 'i2', name: '少冰', price: 0 },
          { id: 'i3', name: '去冰', price: 0 },
          { id: 'i4', name: '溫熱', price: 0 },
        ],
      },
      {
        id: 'sugar',
        name: '甜度選擇',
        required: true,
        options: [
          { id: 'sg1', name: '全糖 (100%)', price: 0 },
          { id: 'sg2', name: '少糖 (70%)', price: 0 },
          { id: 'sg3', name: '半糖 (50%)', price: 0 },
          { id: 'sg4', name: '微糖 (30%)', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'd2',
    name: '鮮榨檸檬冬瓜翡翠',
    category: 'drinks',
    categoryName: '特調飲品/甜點',
    price: 60,
    description: '新鮮屏東檸檬現榨，結合古法熬煮冬瓜磚與清香綠茶。',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    tags: ['解膩', '冷飲'],
    customizationGroups: [
      {
        id: 'ice_lemon',
        name: '冰塊選擇',
        required: true,
        options: [
          { id: 'li1', name: '正常冰', price: 0 },
          { id: 'li2', name: '少冰', price: 0 },
          { id: 'li3', name: '去冰', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'd3',
    name: '古早味焦糖手工布丁',
    category: 'drinks',
    categoryName: '特調飲品/甜點',
    price: 55,
    description: '使用新鮮雞蛋與純牛奶滑嫩烤製，苦甜微焦糖香氣迷人。',
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80',
    tags: ['限量甜點'],
  },

  // 暖胃湯品 Soup
  {
    id: 'sp1',
    name: '剝皮辣椒雞湯',
    category: 'soup',
    categoryName: '暖胃湯品',
    price: 110,
    description: '花蓮嚴選剝皮辣椒與土雞肉甘甜燉煮，湯頭回甘微辣暖胃。',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    tags: ['暖胃', '主廚推薦'],
  },
  {
    id: 'sp2',
    name: '元氣慢燉藥膳排骨湯',
    category: 'soup',
    categoryName: '暖胃湯品',
    price: 120,
    description: '十餘種中藥材與精選肋排慢火熬煮，溫補不燥熱。',
    image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=600&q=80',
    tags: ['養生', '溫補'],
  },
];
