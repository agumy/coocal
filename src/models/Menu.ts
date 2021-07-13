export interface Menu {
  id: string;
  name: string;
  author: string;
  date: string | null;
  url: string;
  shared: boolean;
  ingredientList: Ingredient[];
}

interface Ingredient {
  name: string;
  amount: string;
  hasThis: boolean;
}
