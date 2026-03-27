export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  sizes?: string[];
  isOffer?: boolean;
}

export const MAIN_CATEGORIES = [
  "Perfumería y Lociones",
  "Maquillaje y Rostro",
  "Cuidado Personal",
  "Hogar y Cocina",
  "Ropa, Calzado y Accesorios",
  "Salud y Suplementos"
];

export const QUICK_FILTERS = [
  "Todo",
  "🔥 Ofertas Estrella",
  "✨ Nuevos Ingresos",
  "🎁 Combos Especiales",
  "💎 Alta Gama (Premium)"
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Set Olla y Sartén Antiadherente",
    price: 350.00,
    category: "Hogar y Cocina",
    image: "", 
    isOffer: true
  },
  {
    id: "2",
    name: "Loción Blue Intense Men",
    price: 250.00,
    category: "Perfumería y Lociones",
    image: ""
  },
  {
    id: "3",
    name: "Pantalón Casual de Tela",
    price: 180.00,
    category: "Ropa, Calzado y Accesorios",
    image: "",
    sizes: ["S", "M", "L", "XL"]
  }
];
