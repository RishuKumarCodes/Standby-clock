import AsyncStorage from "@react-native-async-storage/async-storage";

export const PAGE_KEY = "PAGE_DATA";

export interface Pages {
  id: string;
  component: string;
  category:
    | "Date & time"
    | "Calendar"
    | "Weather"
    | "Focus"
    | "Todos"
    | "Music"
    | "Anaylitics";
}

export const DEFAULT_PAGES: Pages[] = [
  {
    id: "1",
    component: "MinimalBold",
    category: "Date & time",
  },
];

export async function getInitialPages(): Promise<Pages[]> {
  try {
    const json = await AsyncStorage.getItem(PAGE_KEY);
    if (json !== null && json !== "null") {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading pages from storage:", e);
  }
  try {
    await AsyncStorage.setItem(PAGE_KEY, JSON.stringify(DEFAULT_PAGES));
  } catch (e) {
    console.error("Error writing default pages to storage:", e);
  }
  return DEFAULT_PAGES;
}

export async function AddNewPage(newPage: Pages): Promise<Pages[]> {
  try {
    const all = await getInitialPages();
    const updated = [...all, newPage];
    await AsyncStorage.setItem(PAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.log("error saving new page:", e);
  }
  return getInitialPages();
}

export async function updatePage(page: Pages): Promise<Pages[]> {
  const all = getInitialPages();
  const updated = (await all).map((p) => (p.id === page.id ? page : p));
  await AsyncStorage.setItem(PAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function resetPage(){
  await AsyncStorage.setItem(PAGE_KEY, JSON.stringify(DEFAULT_PAGES));
  return getInitialPages();
}

export async function deletePage(id: string): Promise<Pages[]> {
  const all = await getInitialPages();
  if (all.length == 1) {
    console.warn("There should be at least one page");
    return all;
  }
  const updated = all.filter((r) => r.id !== id);
  await AsyncStorage.setItem(PAGE_KEY, JSON.stringify(updated));
  return updated;
}
