import { Table } from './models/table.model.js'
import { MenuItem } from './models/menu-item.model.js'
import { User } from './models/user.model.js'
import { Session } from './models/session.model.js'

const TABLES = [
  { id: 1, title: 'میز دونفره لب پنجره', capacity: 2 },
  { id: 2, title: 'میز چهار نفره کنار دیوار', capacity: 4 },
  { id: 3, title: 'میز شش نفره خانوادگی', capacity: 6 },
  { id: 4, title: 'میز دونفره دنج', capacity: 2 },
  { id: 5, title: 'میز چهار نفره حیاط', capacity: 4 },
  { id: 6, title: 'میز شش نفره مخصوص گروه', capacity: 6 }
]
const PRICE_PER_SEAT = 50000

// isAddon: true means the item can be added to a reservation as a hospitality package.
const MENU_ITEMS = [
  {
    id: 1,
    title: 'قهوه اسپرسو',
    price: 80000,
    category: 'نوشیدنی‌ها',
    icon: '☕',
    description: 'قهوه تازه و خوش‌عطر',
    isAddon: true
  },
  {
    id: 2,
    title: 'چیزکیک',
    price: 90000,
    category: 'دسرها',
    icon: '🍰',
    description: 'چیزکیک لطیف و خوشمزه',
    isAddon: true
  },
  {
    id: 3,
    title: 'ماکیاتو',
    price: 100000,
    category: 'نوشیدنی‌ها',
    icon: '☕',
    description: 'اسپرسو با شیر',
    isAddon: true
  },
  {
    id: 4,
    title: 'کیک روز',
    price: 70000,
    category: 'دسرها',
    icon: '🍰',
    description: 'کیک تازه روز',
    isAddon: true
  },
  {
    id: 5,
    title: 'کاپوچینو',
    price: 100000,
    category: 'نوشیدنی‌ها',
    icon: '🥛',
    description: 'اسپرسو با شیر و فوم'
  },
  {
    id: 6,
    title: 'چای',
    price: 50000,
    category: 'نوشیدنی‌ها',
    icon: '🍵',
    description: 'چای گرم و معطر'
  },
  {
    id: 7,
    title: 'کیک شکلاتی',
    price: 90000,
    category: 'دسرها',
    icon: '🍫',
    description: 'کیک شکلاتی تازه'
  },
  {
    id: 8,
    title: 'برگر',
    price: 180000,
    category: 'غذاها',
    icon: '🍔',
    description: 'برگر مخصوص کافه آرامش'
  },
  {
    id: 9,
    title: 'پاستا',
    price: 160000,
    category: 'غذاها',
    icon: '🍝',
    description: 'پاستای گرم با سس مخصوص'
  }
]

// "Insert only if missing": $setOnInsert + upsert never overwrites existing documents,
// so running the seed on every startup is safe and keeps real reservations intact.
function insertIfMissing(documents) {
  return documents.map((doc) => ({
    updateOne: { filter: { id: doc.id }, update: { $setOnInsert: doc }, upsert: true }
  }))
}

export async function seedDatabase() {
  const models = [Table, MenuItem, User, Session]
  // autoCreate/autoIndex are off (see models/database.js), so create them here, once connected.
  await Promise.all(models.map((model) => model.createCollection()))
  await Promise.all(models.map((model) => model.createIndexes()))

  const tables = TABLES.map((table) => ({
    ...table,
    price: table.capacity * PRICE_PER_SEAT,
    reservation: null,
    lockOwner: null,
    lockUntil: null
  }))
  const menuItems = MENU_ITEMS.map((item) => ({ isAddon: false, ...item, available: true }))

  await Table.bulkWrite(insertIfMissing(tables))
  await MenuItem.bulkWrite(insertIfMissing(menuItems))
}
