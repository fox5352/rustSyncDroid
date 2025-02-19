import { create } from "zustand";
import Database from "@tauri-apps/plugin-sql";
import { log } from "../lib/logging";


async function connect(): Promise<Database> {
  const database = await Database.load("sqlite:session.db");

  // create tabel if no there
  database.execute("CREATE TABLE IF NOT EXISTS session (url TEXT, token TEXT, date TEXT);");

  return database;
}

export async function inserInto(data: Session): Promise<boolean> {
  const db = await connect();

  const date = new Date().toISOString();

  try {
    await db.execute("Insert into session Values($1,$2,$3)", [data.url, data.token, date]);
    return true
  } catch (e) {
    //@ts-ignore
    log(e.message);
    return false;
  } finally {
    db.close();
  }
}

export async function getLatestSession(): Promise<Session | null> {
  let db: Database | null = null;

  try {
    db = await connect();

    const result = await db.select<Session>("SELECT url, token FROM session ORDER BY date DESC LIMIT 1");

    // Tauri SQL plugin returns results directly as an array
    if (!result || result.length === 0) {
      return null;
    }

    const session: Session = result[0];
    return session;

  } catch (e) {
    log(`Database error: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  } finally {
    if (db) {
      await db.close();
    }
  }
}



export type Session = {
  url: string;
  token: string;
};

type SessionHook = {
  data: Session | null,
  loading: boolean
  setSession: (session: Session) => Promise<void>;
  clearSession: () => void;
  initializeSession: () => Promise<void>;
};

export const useSession = create<SessionHook>()(
  (set) => ({
    data: null,
    loading: true,
    setSession: async (session: Session) => {
      set({ data: session })
      await inserInto(session);
    },
    clearSession: () => set({ data: null }),
    initializeSession: async () => {
      const latestSession = await getLatestSession();

      set(prevState => {
        return {
          ...prevState,
          data: latestSession,
          loading: false,
        }
      })
    }
  })
);


export async function initializeSessionHook(): Promise<void> {
  await useSession.getState().initializeSession();
}
