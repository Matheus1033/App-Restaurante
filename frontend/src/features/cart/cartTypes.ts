export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

export type CartItem = MenuItem & {
  quantity: number;
};
