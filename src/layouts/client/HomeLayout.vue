<template>
  <div class="site-content">
    <banner-top :is_search_visible="visible_search"></banner-top>
    <headerLayout
      :title="title_header"
      :eslogan="eslogan_header"
      @press-enter="scrollToElement"
    ></headerLayout>
    <more-popular-search
      :title="titulo_carrusel"
      :search_list="carrusel_list"
    ></more-popular-search>
    <filter-layout id="filters" v-intersection="onIntersection"></filter-layout>
  </div>
  <div style="min-height: 100vh; z-index: -1"></div>
  <footer-layout :search_list="carrusel_list"></footer-layout>
</template>

<script>
import HeaderLayout from "./HeaderLayout.vue";
import FilterLayout from "./FilterLayout.vue";
import MorePopularSearch from "../../components/client/MorePopularSearch.vue";
import BannerTop from "../../components/client/BannerTop.vue";
import FooterLayout from "./FooterLayout.vue";

import { ref, onBeforeMount } from "vue";
import { scroll } from "quasar";
import { api } from "boot/axios";
import { useCounterStore } from "../../stores/example-store";

export default {
  name: "IndexPage",
  components: {
    HeaderLayout,
    FilterLayout,
    MorePopularSearch,
    BannerTop,
    FooterLayout,
  },
  setup() {
    const store = useCounterStore();
    const { getScrollTarget, setVerticalScrollPosition } = scroll;
    const view_mode_results = ref(false);
    const carrusel_list = ref([]);
    const title_header = ref(null);
    const eslogan_header = ref(null);
    const titulo_carrusel = ref(null);
    const visible_search = ref(false);

    onBeforeMount(async () => {
      try {
        const response = await api.get("/elementosInterfaz");
        title_header.value = response.data[0].titulo;
        eslogan_header.value = response.data[0].eslogan;
        titulo_carrusel.value = response.data[0].titulo_carrusel;
        carrusel_list.value = response.data[0].obras;
        let authors = [];
        carrusel_list.value.forEach((obra) => {
          authors.push(obra.autores);
        });
        let names = "";
        let namesArray = [];
        authors.forEach((autor) => {
          autor.forEach((el) => {
            names += el.nombre + ", ";
          });
          names = names.substring(0, names.length - 2);
          namesArray.push(names);
          names = "";
        });
        carrusel_list.value.push(namesArray);
      } catch (error) {}
      store.loading_filter_data = true;
      store.no_results = false;
      let filters = {
        input_search: "",
        order: "ASC",
        option_search: store.filter_search.value,
        limit: store.active_row ? 20 : 10,
        page: 1,
        tematicas_id: [],
        formato_id: null,
        authors_id: [],
      };
      try {
        const obras = await api.post("/obras/filtrarObras", filters);
        store.total_pages_literary_works = store.active_row
          ? Math.ceil(obras.data[1] / 20)
          : Math.ceil(obras.data[1] / 10);
        store.current_page_literary_works = 1;
        store.filtered_list_data = obras.data[0];
        let nombre = "";
        store.authors_books = [];
        store.filtered_list_data.forEach((obra) => {
          obra.autores.forEach((autor) => {
            nombre += autor.nombre + ", ";
          });
          const nom = nombre.substring(0, nombre.length - 2);
          nombre = "";
          store.authors_books.push(nom);
        });
      } catch (error) {
        console.log(error);
      } finally {
        store.current_page_literary_works =
          store.total_pages_literary_works === 0
            ? 0
            : store.current_page_literary_works;
        store.loading_filter_data = false;
        store.formats = [];
        store.no_results = store.filtered_list_data.length === 0 ? true : false;
        for (let i = 0; i < store.filtered_list_data.length; i++) {
          store.formats.push([]);
        }
        for (let i = 0; i < store.filtered_list_data.length; i++) {
          store.filtered_list_data[i].expediente.obras.forEach((element) => {
            store.formats[i].push({
              name: element.tipo_trabajo.nombre,
              label: element.tipo_trabajo.nombre,
            });
          });
        }
      }
      const json = {
        limit: 16,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const authors = await api.post(`/autores`, json);
        store.total_pages_authors = Math.ceil(authors.data[1] / 16);
        store.authors_list = authors.data[0];
        store.current_page_authors =
          store.total_pages_authors === 0 ? 0 : store.current_page_authors;
      } catch (error) {
        console.log(error);
      } finally {
      }
    });

    function scrollToElement() {
      const tg = document.getElementById("filters");
      const target = getScrollTarget(tg);
      const offset = tg.offsetTop;
      const duration = 700;
      setVerticalScrollPosition(target, offset, duration);
    }

    function onIntersection(entry) {
      visible_search.value = !visible_search.value;
    }

    return {
      scrollToElement,
      carrusel_list,
      visible_search,
      onIntersection,
      view_mode_results,
      store,
      title_header,
      titulo_carrusel,
      eslogan_header,
    };
  },
};
</script>

<style></style>
