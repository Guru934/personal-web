import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./supabase-browser";

export function useSupabaseSync<T extends any[]>(
  tableName: string,
  localStorageKey: string,
  fallback: T,
  userId: string | undefined
) {
  const [data, setData] = useState<T>(fallback);
  const [syncState, setSyncState] = useState<"loading" | "synced" | "local" | "error">("loading");
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(localStorageKey);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      console.error(`Failed to load ${localStorageKey}:`, e);
    }
    setIsReady(true);
  }, [localStorageKey]);

  // Sync with Supabase
  useEffect(() => {
    if (!isReady || !userId) {
      setSyncState("local");
      return;
    }

    let active = true;

    const syncFromCloud = async () => {
      try {
        const client = createSupabaseBrowserClient();
        if (!client) {
          setSyncState("local");
          return;
        }

        const { data: remoteData, error } = await client
          .from(tableName)
          .select("*")
          .eq("user_id", userId)
          .order("created_at");

        if (!active) return;

        if (error) {
          console.error(`Sync error for ${tableName}:`, error);
          setSyncState("error");
          return;
        }

        // If remote is empty but local has data, sync local to remote
        if (!remoteData?.length && data.length > 0) {
          const itemsToInsert = data.map((item: any) => ({
            user_id: userId,
            ...item,
          }));

          const { error: insertError } = await client
            .from(tableName)
            .insert(itemsToInsert);

          if (insertError) {
            console.error(`Failed to insert initial data:`, insertError);
            setSyncState("error");
            return;
          }
        }

        setData((remoteData as T) || fallback);
        setSyncState("synced");
      } catch (e) {
        console.error(`Unexpected sync error:`, e);
        setSyncState("error");
      }
    };

    void syncFromCloud();
    return () => {
      active = false;
    };
  }, [isReady, userId, tableName, fallback, data.length]);

  // Persist local changes and sync to cloud
  const updateData = (newData: T | ((prev: T) => T)): void => {
    const updated = typeof newData === "function" ? (newData as (prev: T) => T)(data) : newData;
    setData(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));

    // Background sync to Supabase
    if (userId && syncState === "synced" && Array.isArray(updated)) {
      const client = createSupabaseBrowserClient();
      if (client) {
        const items = (updated as any[]).map((item) => ({
          ...item,
          user_id: userId,
          updated_at: new Date().toISOString(),
        }));

        void (async () => {
          try {
            await client.from(tableName).upsert(items, { onConflict: "id" });
          } catch (err) {
            console.error(`Background sync failed for ${tableName}:`, err);
          }
        })();
      }
    }
  };

  return { data, syncState, updateData, isReady };
}
