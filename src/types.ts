export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  isPrescription: boolean;
};

export type CartItem = Product & {
  quantity: number;
  subtotal: number;
};


