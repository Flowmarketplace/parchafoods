export interface Short {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: {
    name: string;
    username: string;
    avatarUrl: string;
    verified?: boolean;
  };
  views: number;
  likes: number;
  category: string;
  placeId?: string;
  placeName?: string;
  createdAt: string;
}
