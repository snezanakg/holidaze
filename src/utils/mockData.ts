export interface Media {
  url: string;
  alt: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  owner: {
    name: string;
    email: string;
    avatar: Media; // V2 API often returns avatar as object too, but sometimes string. Let's stick to Media for consistency if possible, but the API docs say Avatar is {url, alt}.
  };
  bookings?: Booking[];
}

// Helper to safely get image URL
export const getImageUrl = (media: Media[] | undefined): string => {
  if (!media || media.length === 0) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';
  return media[0].url;
};

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  customer?: {
    name: string;
    email: string;
    avatar: Media;
  };
  venueId?: string;
  venue?: {
    name: string;
    media: Media[];
  };
}

export function getMockVenues(): Venue[] {
  return [
    {
      id: '1',
      name: 'Luxury Beach Villa',
      description: 'Experience the ultimate beachfront luxury in this stunning villa. Wake up to breathtaking ocean views, enjoy direct beach access, and relax by your private pool. This spacious villa features modern amenities, elegant furnishings, and an open-concept design perfect for families or groups.',
      media: [
        { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', alt: 'Luxury Villa Exterior' },
        { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop', alt: 'Villa Pool' },
      ],
      price: 450,
      maxGuests: 8,
      rating: 4.9,
      meta: {
        wifi: true,
        parking: true,
        breakfast: false,
        pets: true,
      },
      location: {
        address: '123 Ocean Drive',
        city: 'Miami Beach',
        country: 'USA',
        lat: 25.7907,
        lng: -80.1300,
      },
      owner: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', alt: 'Sarah Johnson' },
      },
    },
    {
      id: '2',
      name: 'Mountain Retreat Cabin',
      description: 'Escape to the mountains in this cozy cabin surrounded by nature. Perfect for a peaceful getaway with stunning mountain views, hiking trails nearby, and a warm fireplace for chilly evenings. The cabin offers rustic charm combined with modern comforts.',
      media: [
        { url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop', alt: 'Mountain Cabin' },
        { url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop', alt: 'Cabin Interior' },
      ],
      price: 180,
      maxGuests: 4,
      rating: 4.7,
      meta: {
        wifi: true,
        parking: true,
        breakfast: true,
        pets: true,
      },
      location: {
        address: '456 Mountain Road',
        city: 'Aspen',
        country: 'USA',
        lat: 39.1911,
        lng: -106.8175,
      },
      owner: {
        name: 'Mike Anderson',
        email: 'mike@example.com',
        avatar: { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', alt: 'Mike Anderson' },
      },
    },
    {
      id: '3',
      name: 'Downtown Loft Apartment',
      description: 'Stay in the heart of the city in this modern loft apartment. Featuring high ceilings, exposed brick, and contemporary design, this space is perfect for business travelers or couples. Walking distance to restaurants, shops, and entertainment.',
      media: [
        { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', alt: 'Downtown Loft' },
        { url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop', alt: 'Loft Interior' },
      ],
      price: 220,
      maxGuests: 2,
      rating: 4.8,
      meta: {
        wifi: true,
        parking: false,
        breakfast: false,
        pets: false,
      },
      location: {
        address: '789 Main Street',
        city: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
      },
      owner: {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        avatar: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', alt: 'Emma Wilson' },
      },
    },
    {
      id: '4',
      name: 'Countryside Farmhouse',
      description: 'Experience rural tranquility in this charming farmhouse. Surrounded by rolling hills and farmland, this property offers a peaceful retreat with plenty of space for families. Enjoy home-cooked meals in the country kitchen and explore the surrounding nature.',
      media: [
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', alt: 'Farmhouse Exterior' },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', alt: 'Farmhouse Kitchen' },
      ],
      price: 160,
      maxGuests: 6,
      rating: 4.6,
      meta: {
        wifi: true,
        parking: true,
        breakfast: true,
        pets: true,
      },
      location: {
        address: '321 Farm Lane',
        city: 'Portland',
        country: 'USA',
        lat: 45.5152,
        lng: -122.6784,
      },
      owner: {
        name: 'John Davis',
        email: 'john@example.com',
        avatar: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', alt: 'John Davis' },
      },
    },
    {
      id: '5',
      name: 'Seaside Cottage',
      description: 'Charming coastal cottage with stunning sea views. Perfect for a romantic getaway or small family vacation. The cottage features a private deck, modern kitchen, and is just steps from the beach. Watch the sunset from your own patio.',
      media: [
        { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop', alt: 'Seaside Cottage' },
        { url: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop', alt: 'Cottage Deck' },
      ],
      price: 195,
      maxGuests: 3,
      rating: 4.8,
      meta: {
        wifi: true,
        parking: true,
        breakfast: false,
        pets: false,
      },
      location: {
        address: '567 Coastal Way',
        city: 'San Diego',
        country: 'USA',
        lat: 32.7157,
        lng: -117.1611,
      },
      owner: {
        name: 'Lisa Martinez',
        email: 'lisa@example.com',
        avatar: { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', alt: 'Lisa Martinez' },
      },
    },
    {
      id: '6',
      name: 'Urban Studio Suite',
      description: 'Compact and efficient studio in a prime downtown location. Ideal for solo travelers or business trips. Features a Murphy bed, kitchenette, and workspace. Building amenities include gym and rooftop terrace.',
      media: [
        { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', alt: 'Urban Studio' },
        { url: 'https://images.unsplash.com/photo-1595526051245-c200c6604b17?w=800&h=600&fit=crop', alt: 'Studio Workspace' },
      ],
      price: 120,
      maxGuests: 1,
      rating: 4.5,
      meta: {
        wifi: true,
        parking: false,
        breakfast: false,
        pets: false,
      },
      location: {
        address: '890 Urban Ave',
        city: 'Chicago',
        country: 'USA',
        lat: 41.8781,
        lng: -87.6298,
      },
      owner: {
        name: 'David Lee',
        email: 'david@example.com',
        avatar: { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', alt: 'David Lee' },
      },
    },
  ];
}

export function getMockBookings(): Booking[] {
  const venues = getMockVenues();
  return [
    {
      id: 'b1',
      dateFrom: '2026-02-15',
      dateTo: '2026-02-20',
      guests: 4,
      venueId: '1',
      venue: {
        name: venues[0].name,
        media: venues[0].media,
      },
    },
    {
      id: 'b2',
      dateFrom: '2026-03-10',
      dateTo: '2026-03-15',
      guests: 2,
      venueId: '3',
      venue: {
        name: venues[2].name,
        media: venues[2].media,
      },
    },
  ];
}