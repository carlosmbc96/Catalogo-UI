import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    search_input: "",
    filter_search: { label: "Todo", value: "Todo" },
    leftDrawerOpen: false,
    loading_filter_data: false,
    filtered_list_data: [],
    formats: [],
    order_selection_literary_woks: "A - Z",
    order_selection_authors: "A - Z",
    filter_list_toolbar_copy: [],
    filter_list_toolbar_copy_mobile: [],
    filter_list: [],
    filter_list_mobile: [],
    authors_list: [],
    authors_books: [],
    total_pages_literary_works: 0,
    total_pages_authors: 0,
    active_row: false,
    active_col: true,
    current_page_literary_works: 1,
    current_page_authors: 1,
    no_results: false,
    permissions: [],
    user: null,
  }),
  getters: {
    getPermissions: (state) => state.permissions,
  },
});
