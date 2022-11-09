<template>
  <q-input
    v-if="!$q.screen.lt.sm"
    label-color="grey-6"
    color="grey-4"
    outlined
    clearable
    @clear="search_data"
    class="general-search"
    v-model="store.search_input"
    label="Busque por autores, títulos..."
    style="width: 100%; height: 60px"
    @keyup.enter="search_data"
  >
    <template v-slot:prepend>
      <q-icon name="search" @click="search_data" class="icon-search" />
    </template>
    <template v-slot:append>
      <q-select
        class="select-input"
        label-color="grey-6"
        v-model="store.filter_search"
        :options="options"
        borderless
      >
      </q-select>
    </template>
  </q-input>
  <q-input
    v-else
    label-color="grey-6"
    color="grey-4"
    outlined
    clearable
    @clear="search_data_mobile"
    class="general-search"
    v-model="store.search_input"
    label="Busque por autores, títulos..."
    style="width: 100%; height: 60px"
    @keyup.enter="search_data_mobile"
  >
    <template v-slot:prepend>
      <q-icon name="search" @click="search_data_mobile" class="icon-search" />
    </template>
  </q-input>
</template>

<script>
import { ref } from "vue";
import { api } from "boot/axios";
import { useCounterStore } from "../../stores/example-store";
import { useQuasar } from "quasar";

export default {
  name: "GeneralSearch",
  setup(props, { emit }) {
    const store = useCounterStore();
    const $q = useQuasar();
    $q.screen.setSizes({ sm: 721 });

    async function search_data() {
      //TODO: esta funcion tengo que hacerla un composable porque la uso en dos componentes
      store.loading_filter_data = true;
      store.no_results = false;
      let tematicas = [];
      let formato = null;
      let authors = [];
      store.filter_list_toolbar_copy.forEach((item) => {
        let is_author = true;
        store.filter_list[0].forEach((tematica) => {
          if (tematica.nombre === item.nombre) {
            is_author = false;
            tematicas.push(item.id);
          }
        });
        store.filter_list[1].forEach((format) => {
          //TODO: esto sustituirlo por un while para hacer la busqueda mas optima
          if (format.nombre === item.nombre) {
            is_author = false;
          }
        });
        if (is_author) {
          authors.push(item.id);
        }
      });
      store.filter_list[1].forEach((format) => {
        //TODO: esto sustituirlo por un while para hacer la busqueda mas optima
        formato = format.chk ? format.id : formato;
      });

      let filters = {
        input_search: store.search_input,
        order: store.order_selection_literary_woks === "A - Z" ? "ASC" : "DESC",
        option_search: store.filter_search.value,
        limit: store.active_row ? 20 : 10,
        page: 1,
        tematicas_id: tematicas,
        formato_id: formato,
        authors_id: authors,
      };

      const obras = await api.post("/obras/filtrarObras", filters);
      try {
        store.total_pages_literary_works = store.active_row
          ? Math.ceil(obras.data[1] / 20)
          : Math.ceil(obras.data[1] / 10);
        store.current_page_literary_works = 1;
        store.filtered_list_data = obras.data[0];
        let nombre = "";
        store.authors_books = [];
        store.filtered_list_data.forEach((obra) => {
          obra.autores.forEach((autor) => {
            nombre += autor.nombre + ",";
          });
          const nom = nombre.substring(0, nombre.length - 1);
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
        store.no_results = store.filtered_list_data.length === 0 ? true : false;
        store.no_results = store.filtered_list_data.length === 0 ? true : false;
        store.formats = [];
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
      emit("pressEnter");
    }

    async function search_data_mobile() {
      //TODO: esta funcion tengo que hacerla un composable porque la uso en dos componentes
      store.loading_filter_data = true;
      store.no_results = false;
      let tematicas = [];
      let formato = null;
      let authors = [];
      let is_author = true;
      store.filter_list_toolbar_copy_mobile.forEach((item) => {
        store.filter_list_mobile[0].forEach((tematica) => {
          if (tematica.nombre === item.nombre) {
            is_author = false;
            tematicas.push(tematica.id);
          }
        });
        store.filter_list_mobile[1].forEach((format) => {
          //TODO: esto sustituirlo por un while para hacer la busqueda mas optima
          if (format.nombre === item.nombre) {
            is_author = false;
          }
        });
        if (is_author) {
          authors.push(item.id);
        }
      });
      store.filter_list_mobile[1].forEach((format) => {
        //TODO: esto sustituirlo por un while para hacer la busqueda mas optima
        formato = format.chk ? format.id : formato;
      });

      let filters = {
        input_search: store.search_input,
        order: store.order_selection_literary_woks === "A - Z" ? "ASC" : "DESC",
        option_search: store.filter_search.value,
        limit: store.active_row ? 20 : 10,
        page: 1,
        tematicas_id: tematicas,
        formato_id: formato,
        authors_id: authors,
      };

      const obras = await api.post("/obras/filtrarObras", filters);
      try {
        store.total_pages_literary_works = store.active_row
          ? Math.ceil(obras.data[1] / 20)
          : Math.ceil(obras.data[1] / 10);
        store.current_page_literary_works = 1;
        store.filtered_list_data = obras.data[0];
        let nombre = "";
        store.authors_books = [];
        store.filtered_list_data.forEach((obra) => {
          obra.autores.forEach((autor) => {
            nombre += autor.nombre + ",";
          });
          const nom = nombre.substring(0, nombre.length - 1);
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
        store.no_results = store.filtered_list_data.length === 0 ? true : false;
        store.no_results = store.filtered_list_data.length === 0 ? true : false;
        store.formats = [];
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
      emit("pressEnter");
    }
    return {
      store,
      search_data,
      search_data_mobile,
      options: [
        { label: "Todo", value: "Todo" },
        { label: "Título", value: "Titulo" },
        { label: "Autor", value: "Autor" },
        { label: "Temática", value: "Tematica" },
      ],
    };
  },
};
</script>

<style scoped>
.icon-search {
  cursor: pointer;
  font-size: 35px;
}
</style>
