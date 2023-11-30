import {categoriesTypes} from '@utils/categories';

export interface AudioData {
  id: string;
  title: string;
  about: string;
  category: categoriesTypes;
  file: string;
  poster?: string;
  owner: {
    id: string;
    name: string;
  };
}

export interface Playlist {
  id: string;
  title: string;
  itemsCount: number;
  visibility: 'public' | 'private';
}

export type HistoryAudio = {
  id: string;
  audioId: string;
  title: string;
  date: string;
};
export interface History {
  date: string;
  audios: HistoryAudio[];
}
