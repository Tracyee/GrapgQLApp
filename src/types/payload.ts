export type User = {
  _id: string;
  email?: string;
  createdEvents?: Event[];
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  price: number;
  date: string;
  creator?: User;
};

export type Booking = {
  _id: string;
  event: Event;
  user: User;
  createdAt: string;
  updatedAt: string;
};
