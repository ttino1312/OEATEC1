// lib/types.ts

export interface RadioMetadata {
  title: string;
  artist: string;
  show: string;
  cover: string;
  listeners: number;
  live: boolean;
  presenter?: string;
}

export interface Show {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  days: string[];
  cover_url?: string;
  presenter_names?: string[];
  presenter_ids?: number[];
  active: number;
}

export interface Presenter {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  bio?: string;
  active: number;
}

export interface Recording {
  id: number;
  show_id?: number;
  show_title?: string;
  title: string;
  description?: string;
  file_url: string;
  duration_sec: number;
  published: number;
  recorded_at: string;
}

export const DAYS_MAP: Record<string, string> = {
  '1': 'Lunes',
  '2': 'Martes',
  '3': 'Miércoles',
  '4': 'Jueves',
  '5': 'Viernes',
  '6': 'Sábado',
  '7': 'Domingo',
};

export const DAYS_SHORT: Record<string, string> = {
  '1': 'Lun',
  '2': 'Mar',
  '3': 'Mié',
  '4': 'Jue',
  '5': 'Vie',
  '6': 'Sáb',
  '7': 'Dom',
};

export function formatDuration(seconds: number): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
