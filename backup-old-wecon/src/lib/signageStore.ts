import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Types aligned with intended Prisma models
export type DisplayOrientation = 'LANDSCAPE' | 'PORTRAIT';
export type DisplayStatus = 'ONLINE' | 'OFFLINE' | 'ERROR';
export type SignageContentType = 'IMAGE' | 'VIDEO' | 'TEXT';
export type SignageContentStatus = 'DRAFT' | 'ACTIVE' | 'SCHEDULED';

export interface DigitalDisplay {
  id: string;
  name: string;
  location?: string;
  resolution?: string;
  orientation: DisplayOrientation;
  status: DisplayStatus;
  lastHeartbeatAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignageContent {
  id: string;
  name: string;
  type: SignageContentType;
  url?: string;
  contentText?: string;
  duration: number;
  status: SignageContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DigitalPlaylist {
  id: string;
  name: string;
  loop: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaylistItem {
  id: string;
  playlistId: string;
  contentId: string;
  orderIndex: number;
  durationOverride?: number;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'signage.json');

interface FileState {
  displays: DigitalDisplay[];
  content: SignageContent[];
  playlists: DigitalPlaylist[];
  playlistItems: PlaylistItem[];
}

function ensureFile(): FileState {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    if (!fs.existsSync(FILE_PATH)) {
      const initial: FileState = { displays: [], content: [], playlists: [], playlistItems: [] };
      fs.writeFileSync(FILE_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(raw) as FileState;
  } catch (e) {
    // As a last resort, keep in-memory fallback (not persisted)
    return { displays: [], content: [], playlists: [], playlistItems: [] };
  }
}

function saveFile(state: FileState) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    fs.writeFileSync(FILE_PATH, JSON.stringify(state, null, 2), 'utf8');
  } catch {}
}

async function tryPrisma<T>(fn: () => Promise<T>): Promise<{ ok: true; data: T } | { ok: false; error: any }> {
  try {
    const data = await fn();
    return { ok: true, data } as const;
  } catch (error: any) {
    // When models/tables are missing (before migration), fallback to FILE
    return { ok: false, error } as const;
  }
}

export const SignageStore = {
  // Displays
  async listDisplays(): Promise<DigitalDisplay[]> {
    const result = await tryPrisma(() => prisma.digitalDisplay.findMany({ orderBy: { createdAt: 'desc' } } as any));
    if (result.ok) return result.data as any;
    const state = ensureFile();
    return state.displays;
  },
  async createDisplay(input: Omit<DigitalDisplay, 'id' | 'createdAt' | 'updatedAt' | 'lastHeartbeatAt' | 'status'> & { status?: DisplayStatus }): Promise<DigitalDisplay> {
    const payload = { ...input, status: input.status || 'OFFLINE', orientation: input.orientation || 'LANDSCAPE' } as any;
    const result = await tryPrisma(() => prisma.digitalDisplay.create({ data: payload } as any));
    if (result.ok) return result.data as any;
    const state = ensureFile();
    const item: DigitalDisplay = { id: String(Date.now()), ...payload };
    state.displays.unshift(item);
    saveFile(state);
    return item;
  },
  async updateDisplay(id: string, data: Partial<DigitalDisplay>): Promise<DigitalDisplay> {
    const result = await tryPrisma(() => prisma.digitalDisplay.update({ where: { id }, data } as any));
    if (result.ok) return result.data as any;
    const state = ensureFile();
    const idx = state.displays.findIndex(d => d.id === id);
    if (idx >= 0) {
      state.displays[idx] = { ...state.displays[idx], ...data } as any;
      saveFile(state);
      return state.displays[idx];
    }
    throw new Error('Display not found');
  },
  async deleteDisplay(id: string): Promise<void> {
    const result = await tryPrisma(() => prisma.digitalDisplay.delete({ where: { id } } as any));
    if (result.ok) return;
    const state = ensureFile();
    state.displays = state.displays.filter(d => d.id !== id);
    state.playlistItems = state.playlistItems.filter(pi => pi.playlistId !== id && pi.contentId !== id);
    state.playlists = state.playlists.filter(p => p.id !== id);
    saveFile(state);
  },

  // Content
  async listContent(): Promise<SignageContent[]> {
    const result = await tryPrisma(() => prisma.signageContent.findMany({ orderBy: { createdAt: 'desc' } } as any));
    if (result.ok) return result.data as any;
    return ensureFile().content;
  },
  async createContent(input: Omit<SignageContent, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: SignageContentStatus }): Promise<SignageContent> {
    const payload = { ...input, status: input.status || 'DRAFT' } as any;
    const result = await tryPrisma(() => prisma.signageContent.create({ data: payload } as any));
    if (result.ok) return result.data as any;
    const state = ensureFile();
    const item: SignageContent = { id: String(Date.now()), ...payload };
    state.content.unshift(item);
    saveFile(state);
    return item;
  },
  async updateContent(id: string, data: Partial<SignageContent>): Promise<SignageContent> {
    const result = await tryPrisma(() => prisma.signageContent.update({ where: { id }, data } as any));
    if (result.ok) return result.data as any;
    const state = ensureFile();
    const idx = state.content.findIndex(c => c.id === id);
    if (idx >= 0) {
      state.content[idx] = { ...state.content[idx], ...data } as any;
      saveFile(state);
      return state.content[idx];
    }
    throw new Error('Content not found');
  },
  async deleteContent(id: string): Promise<void> {
    const result = await tryPrisma(() => prisma.signageContent.delete({ where: { id } } as any));
    if (result.ok) return;
    const state = ensureFile();
    state.content = state.content.filter(c => c.id !== id);
    state.playlistItems = state.playlistItems.filter(pi => pi.contentId !== id);
    saveFile(state);
  },

  // Playlists
  async listPlaylists(): Promise<(DigitalPlaylist & { items: (PlaylistItem & { content?: SignageContent })[] })[]> {
    const result = await tryPrisma(() => prisma.digitalPlaylist.findMany({ include: { items: { include: { content: true } } } } as any));
    if (result.ok) return result.data as any;
    const state = ensureFile();
    return state.playlists.map(p => ({
      ...p,
      items: state.playlistItems
        .filter(pi => pi.playlistId === p.id)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(pi => ({ ...pi, content: state.content.find(c => c.id === pi.contentId) }))
    }));
  },
  async createPlaylist(input: Omit<DigitalPlaylist, 'id' | 'createdAt' | 'updatedAt'> & { items?: { contentId: string; orderIndex?: number; durationOverride?: number }[] }): Promise<DigitalPlaylist> {
    const result = await tryPrisma(async () => {
      return await prisma.digitalPlaylist.create({
        data: {
          name: input.name,
          loop: input.loop ?? true,
          items: input.items && input.items.length ? {
            create: input.items.map(it => ({ contentId: it.contentId, orderIndex: it.orderIndex ?? 0, durationOverride: it.durationOverride }))
          } : undefined
        }
      } as any);
    });
    if (result.ok) return result.data as any;
    const state = ensureFile();
    const playlist: DigitalPlaylist = { id: String(Date.now()), name: input.name, loop: input.loop ?? true };
    state.playlists.unshift(playlist);
    if (input.items?.length) {
      input.items.forEach((it, idx) => state.playlistItems.push({ id: `${playlist.id}-${idx}`, playlistId: playlist.id, contentId: it.contentId, orderIndex: it.orderIndex ?? idx }));
    }
    saveFile(state);
    return playlist;
  },
  async updatePlaylist(id: string, data: Partial<DigitalPlaylist> & { items?: { contentId: string; orderIndex?: number; durationOverride?: number }[] }): Promise<DigitalPlaylist> {
    const result = await tryPrisma(async () => {
      // Update meta; items managed separately by client or via replace
      return await prisma.digitalPlaylist.update({ where: { id }, data: { name: data.name, loop: data.loop } } as any);
    });
    if (result.ok) return result.data as any;
    const state = ensureFile();
    const idx = state.playlists.findIndex(p => p.id === id);
    if (idx < 0) throw new Error('Playlist not found');
    state.playlists[idx] = { ...state.playlists[idx], ...data } as any;
    if (data.items) {
      state.playlistItems = state.playlistItems.filter(pi => pi.playlistId !== id);
      data.items.forEach((it, i) => state.playlistItems.push({ id: `${id}-${i}`, playlistId: id, contentId: it.contentId, orderIndex: it.orderIndex ?? i, durationOverride: it.durationOverride }));
    }
    saveFile(state);
    return state.playlists[idx];
  },
  async deletePlaylist(id: string): Promise<void> {
    const result = await tryPrisma(async () => {
      await prisma.playlistItem.deleteMany({ where: { playlistId: id } } as any);
      await prisma.digitalPlaylist.delete({ where: { id } } as any);
    });
    if (result.ok) return;
    const state = ensureFile();
    state.playlistItems = state.playlistItems.filter(pi => pi.playlistId !== id);
    state.playlists = state.playlists.filter(p => p.id !== id);
    saveFile(state);
  },
};

