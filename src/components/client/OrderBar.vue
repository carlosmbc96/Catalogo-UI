<template>
  <div
    style="background-color: #eff3f6; padding-right: 3%"
    class="row justify-end items-center q-gutter-x-xs q-pt-sm"
  >
    <div
      v-if="tabs === 'literary_works'"
      class="col-2"
      style="text-align: end; width: auto"
    >
      <q-icon
        name="view_list"
        size="25px"
        class="q-ml-md icon-layout"
        :class="{ active: active_row }"
        @click="
          $q.screen.lt.sm || $q.screen.lt.md
            ? changeViewMobile('row')
            : changeView('row')
        "
      />
      <q-icon
        name="view_column"
        size="25px"
        class="q-ml-xs icon-layout"
        :class="{ active: active_col }"
        @click="
          $q.screen.lt.sm || $q.screen.lt.md
            ? changeViewMobile('col')
            : changeView('col')
        "
      />
    </div>
    <div v-if="!$q.screen.lt.sm" class="col-2" style="text-align: center">
      <span
        v-if="tabs === 'literary_works'"
        style="color: rgba(91, 91, 91, 0.4); margin-right: 4%"
        >|</span
      >
      <span style="color: rgba(0, 0, 0, 0.7)">Ordenar por:</span>
    </div>
    <div v-if="!$q.screen.lt.sm" class="col-2">
      <div v-if="tabs === 'literary_works'" class="col-2">
        <q-select
          outlined
          v-model="store.order_selection_literary_woks"
          @update:model-value="changeView(null)"
          :options="order_list"
          style="background-color: white; border-radius: 10px"
          dense
        />
      </div>
      <div v-else class="col-2">
        <q-select
          outlined
          v-model="store.order_selection_authors"
          @update:model-value="changeView(null)"
          :options="order_list"
          style="background-color: white; border-radius: 10px"
          dense
        />
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import { useCounterStore } from "../../stores/example-store";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

export default {
  name: "OrderBar",
  props: ["tab"],
  setup(props) {
    const $q = useQuasar();
    const tabs = ref(props.tab);
    const store = useCounterStore();
    const order_list = ref(["A - Z", "Z - A"]);
    const active_row = ref(false);
    const active_col = ref(true);
    $q.screen.setSizes({ sm: 721, md: 1366 });

    watch(
      () => store.active_col,
      () => {
        active_col.value = !active_col.value;
        active_row.value = !active_row.value;
        store.current_page_literary_works = 1;
      }
    );

    async function changeView(mode) {
      if (tabs.value === "literary_works") {
        if (mode === "row") {
          store.active_row = true;
          store.active_col = false;
        } else if (mode === "col") {
          store.active_col = true;
          store.active_row = false;
        }
        //TODO: esta funcion tengo que hacerla un composable porque la uso en varios componentes
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
              tematicas.push(tematica.id);
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
          order:
            store.order_selection_literary_woks === "A - Z" ? "ASC" : "DESC",
          option_search: store.filter_search.value,
          limit: store.active_row ? 20 : 10,
          page: 1,
          tematicas_id: tematicas,
          formato_id: formato,
          authors_id: authors,
        };

        try {
          const obras = await api.post("/obras/filtrarObras", filters);
          store.total_pages_literary_works = store.active_row
            ? Math.ceil(obras.data[1] / 20)
            : Math.ceil(obras.data[1] / 10);
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
        } catch (error) {
          console.log(error);
        } finally {
          store.loading_filter_data = false;
          store.no_results =
            store.filtered_list_data.length === 0 ? true : false;
        }
      } else {
        store.loading_filter_data = true;
        const json = {
          limit: 16,
          page: store.current_page_authors,
          order: store.order_selection_authors === "A - Z" ? "ASC" : "DESC",
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
          store.loading_filter_data = false;
          store.no_results =
            store.filtered_list_data.length === 0 ? true : false;
        }
      }
    }

    async function changeViewMobile(mode) {
      if (tabs.value === "literary_works") {
        if (mode === "row") {
          store.active_row = true;
          store.active_col = false;
        } else if (mode === "col") {
          store.active_col = true;
          store.active_row = false;
        }
        //TODO: esta funcion tengo que hacerla un composable porque la uso en varios componentes
        store.loading_filter_data = true;
        store.no_results = false;
        let tematicas = [];
        let formato = null;
        let authors = [];
        store.filter_list_toolbar_copy_mobile.forEach((item) => {
          let is_author = true;
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
          order:
            store.order_selection_literary_woks === "A - Z" ? "ASC" : "DESC",
          option_search: store.filter_search.value,
          limit: store.active_row ? 20 : 10,
          page: 1,
          tematicas_id: tematicas,
          formato_id: formato,
          authors_id: authors,
        };

        try {
          const obras = await api.post("/obras/filtrarObras", filters);
          store.total_pages_literary_works = store.active_row
            ? Math.ceil(obras.data[1] / 20)
            : Math.ceil(obras.data[1] / 10);
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
        } catch (error) {
          console.log(error);
        } finally {
          store.loading_filter_data = false;
          store.no_results =
            store.filtered_list_data.length === 0 ? true : false;
        }
      } else {
        store.loading_filter_data = true;
        const json = {
          limit: 16,
          page: store.current_page_authors,
          order: store.order_selection_authors === "A - Z" ? "ASC" : "DESC",
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
          store.loading_filter_data = false;
          store.no_results =
            store.filtered_list_data.length === 0 ? true : false;
        }
      }
    }
    return {
      order_list,
      active_row,
      active_col,
      changeView,
      changeViewMobile,
      tabs,
      store,
    };
  },
};
</script>
<style scoped>
.icon-layout {
  color: rgba(91, 91, 91, 0.4);
  cursor: pointer;
}
.icon-layout:hover {
  color: #5b5b5b;
}
.active {
  color: #5b5b5b;
}
</style>
