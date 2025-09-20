
export interface Comment {
  id: string;
  text: string;
  x: number; // Percentage
  y: number; // Percentage
}

export interface Design {
  id: string;
  name: string;
  imageUrl: string;
  comments: Comment[];
  generalComments: string[];
}

export interface Project {
  id:string;
  name: string;
  password?: string; // Stored in-memory, not for production use
  designs: Design[];
}

export interface NewComment {
  text: string;
  x: number;
  y: number;
}
