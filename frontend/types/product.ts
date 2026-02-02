export interface IDistancePrice {
  town: string;
  price: number;
}

export interface IProduct {
  _id: string;
  name: string;
  basePrice: number;
  distancePrices: IDistancePrice[];
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
