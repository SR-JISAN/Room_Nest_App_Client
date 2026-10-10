export type Room = {
  id: string;
  name?: string;
  title?: string;
  description?: string;

  rentAmount?: number | string;
  securityDeposit?: number | string;
  subRentAmount?: number | string | null;

  currentRoommates?: number;
  maxRoommates?: number;

  roomStatus?: string;
  status?: string;
  roomType?: string;

  roomImages?: Array<
    string | { id?: string; roomImageURL?: string; url?: string }
  >;
  images?: string[];

  imageURL?: string;
  imageUrl?: string;

  size?: number | string;
  bathroom?: string;
  amenities?: string[];
  roomAmenities?: Array<
    | string
    | {
        id?: string;
        amenityId?: string;
        amenity?: { id?: string; amenityName: string };
        amenityName?: string;
      }
  >;
  reviews?: Array<{
    id: string;
    name: string;
    email: string;
    note: string;
    reviewRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | string;
    createdAt?: string;
  }>;
};

export type Property = {
  id: string;

  title: string;
  name?: string;
  propertyName?: string;
  description?: string;

  address?: string;
  location?: string;
  city?: string;
  area?: string;
  latitude?: string;
  longitude?: string;

  propertyType?: string;
  propertyStatus?: string;
  status?: string;
  verified?: boolean;

  rentAmount?: number | string;
  price?: number | string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number | string;

  amenities?: string[];
  facilities?: string[];
  propertyAmenities?: Array<{
    id?: string;
    amenity?: { id?: string; amenityName: string };
    amenityName?: string;
  }>;

  propertyImages?: Array<
    | string
    | {
        id?: string;
        propertyImageURL?: string;
        url?: string;
        imageUrl?: string;
      }
  >;
  images?: string[];

  imageURL?: string;
  imageUrl?: string;
  coverImage?: string;
  thumbnail?: string;
  image?: string;

  rooms?: Room[];
  createdAt?: string;
};
