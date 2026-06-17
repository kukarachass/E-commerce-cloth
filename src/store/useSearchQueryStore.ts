import {create} from "zustand/react";

interface SearchQueryStore {
    query: string;
    setQuery: (value: string) => void;
}

export const useSearchQueryStore = create<SearchQueryStore>()((set) => ({
    query: "",
    setQuery: (value) => set({ query: value}),
}))
