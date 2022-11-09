<template>
  <!-- column view mode -->
  <div
    v-if="store.active_col"
    class="row q-pt-lg justify-center q-gutter-md"
    style="
      background-color: #eff3f6;
      min-height: 100vh;
      padding-left: 10px;
      padding-right: 10px;
    "
  >
    <div
      v-if="store.no_results && !$q.screen.lt.sm"
      class="empty-results col-12 row flex-center"
    >
      <q-icon name="search_off" color="grey-13" size="200px" />No se encontraron
      resultados...
    </div>
    <div
      v-if="store.no_results && $q.screen.lt.sm"
      class="empty-results col-12 row flex-center"
    >
      <q-icon
        :class="$q.screen.lt.sm ? 'empty-result-mobile-icon' : ''"
        name="search_off"
        color="grey-13"
        size="200px"
      />
      <span style="font-size: 0.45em !important"
        >No se encontraron resultados...</span
      >
    </div>
    <div v-else-if="store.loading_filter_data" class="col-12 row flex-center">
      <q-spinner-dots size="4rem" color="grey-14" />
    </div>
    <div
      class="div-card"
      v-else
      v-for="(book, index) in store.filtered_list_data"
      :key="index"
    >
      <q-card class="book-card-col shadow-5">
        <div
          style="height: 160px"
          class="my-padding row flex-center"
          @click="showDetails(book)"
        >
          <q-img
            v-if="book.portada !== null"
            style="border-radius: 10px 10px 0px 0px"
            height="160px"
            no-spinner
            :src="getFrontImage(book)"
          />
          <q-icon
            v-else
            name="image_not_supported"
            size="100px"
            style="color: rgba(91, 91, 91, 0.6)"
          />
        </div>
        <div class="q-pa-sm">
          <div
            @click="showDetails(book)"
            class="my-padding title"
            style="height: 60px; color: #5b5b5b"
          >
            <span
              :class="$q.screen.lt.sm ? 'card-obra-colum' : ''"
              style="color: #5b5b5b; font-size: 18px; font-weight: 600"
              >{{ book.titulo }}</span
            >
          </div>
          <div class="my-padding card-colum-formats">
            <q-tabs
              indicator-color="transparent"
              v-model="tab"
              inline-label
              outside-arrows
              mobile-arrows
            >
              <q-tab
                v-for="format in store.formats[index]"
                :key="format.name"
                v-bind="format"
                style="
                  background-color: rgba(24, 169, 226, 0.2);
                  padding: 0 10px;
                  border-radius: 5px;
                  color: #2375a9;
                  min-height: 0px;
                  height: 20px;
                  margin-right: 3px;
                  max-width: 120px;
                "
              />
            </q-tabs>
          </div>
          <div
            v-if="!$q.screen.lt.sm"
            @click="showDetails(book)"
            class="my-padding summary"
            style="height: 95px; color: #9c9c9c; font-size: 13px"
          >
            {{ book.peq_resenha_obra }}
          </div>
          <q-separator
            class="q-my-md"
            :class="$q.screen.lt.sm ? 'card-obra-colum-separator' : ''"
          />
          <div
            @click="showDetails(book)"
            class="authors"
            style="height: 21px; color: #2375a9"
          >
            <q-icon name="person" size="sm" class="q-mr-sm" />
            <span
              :class="$q.screen.lt.sm ? 'card-obra-colum-authors' : ''"
              style="font-size: 15px; font-weight: 600"
              >{{ store.authors_books[index] }}</span
            >
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-12 q-pb-sm row justify-center items-end">
      <q-btn
        dense
        outline
        :disable="
          store.current_page_literary_works === 1 ||
          store.current_page_literary_works === 0
        "
        flat
        round
        style="color: #2375a9"
        icon="first_page"
        @click="getData('first')"
      />
      <q-btn
        dense
        outline
        flat
        round
        :disable="
          store.current_page_literary_works === 1 ||
          store.current_page_literary_works === 0
        "
        style="color: #2375a9"
        @click="getData('back')"
        icon="chevron_left"
      />
      <q-badge>
        {{ store.current_page_literary_works }}/{{
          store.total_pages_literary_works
        }}
      </q-badge>

      <q-btn
        dense
        :disable="
          store.current_page_literary_works ===
            store.total_pages_literary_works ||
          store.total_pages_literary_works === 0
        "
        outline
        flat
        round
        style="color: #2375a9"
        icon="chevron_right"
        @click="getData('next')"
      />
      <q-btn
        dense
        outline
        :disable="
          store.current_page_literary_works ===
            store.total_pages_literary_works ||
          store.total_pages_literary_works === 0
        "
        flat
        round
        style="color: #2375a9"
        icon="last_page"
        @click="getData('last')"
      />
    </div>
  </div>

  <!-- row view mode -->
  <div
    v-else
    class="row col-12 q-px-xl q-pt-xs q-py-sm"
    style="
      background-color: #eff3f6;
      min-height: 100vh;
      align-content: flex-start;
    "
    :class="$q.screen.lt.sm ? 'card-obra-row' : ''"
  >
    <div
      v-if="store.no_results && !$q.screen.lt.sm"
      class="empty-results col-12 row flex-center"
    >
      <q-icon name="search_off" size="200px" color="grey-13" />No se encontraron
      resultados...
    </div>
    <div
      v-if="store.no_results && $q.screen.lt.sm"
      class="col-12 row flex-center"
    >
      <q-icon
        :class="$q.screen.lt.sm ? 'empty-result-mobile-icon' : ''"
        name="search_off"
        color="grey-13"
        size="200px"
      />
      <span class="empty-results-mobile" style="font-size: 0.6em !important"
        >No se encontraron resultados...</span
      >
    </div>
    <div v-else-if="store.loading_filter_data" class="col-12 row flex-center">
      <q-spinner-dots class="flex-center" size="4rem" color="grey-14" />
    </div>
    <q-card
      v-else
      v-for="(book, index) in store.filtered_list_data"
      :key="index"
      class="book-card-row q-mb-sm"
      :class="$q.screen.lt.sm ? 'card-obra-row-row' : ''"
      style="border-radius: 10px"
    >
      <div class="row flex-center">
        <div
          class="col-1 row"
          @click="showDetails(book)"
          :class="$q.screen.lt.sm ? 'col-2' : ''"
        >
          <q-img
            v-if="book.portada !== null"
            no-spinner
            :class="$q.screen.lt.sm ? 'card-obra-row-img' : ''"
            height="50px"
            width="60px"
            fit="fill"
            :src="getFrontImage(book)"
            style="border-radius: 10px 0px 0px 10px"
          />
          <q-icon
            v-else
            name="image_not_supported"
            size="50px"
            style="color: rgba(91, 91, 91, 0.6); margin-left: 0.1em"
          />
        </div>
        <div
          @click="showDetails(book)"
          class="col authors"
          :class="$q.screen.lt.sm ? 'card-obra-row-title-col' : ''"
          style="width: 296px; height: 27px; margin-left: 5px"
        >
          <span
            :class="$q.screen.lt.sm ? 'card-obra-row-title' : ''"
            style="color: #5b5b5b; font-size: 18px"
            >{{ book.titulo }}</span
          >
          <span
            :class="$q.screen.lt.sm ? 'card-obra-row-authors' : ''"
            class="authors"
            style="color: #5b5b5b; font-size: 12px"
            >{{ store.authors_books[index] }}</span
          >
        </div>
        <div class="col text-center my-padding">
          <q-tabs v-model="tab" inline-label outside-arrows mobile-arrows>
            <q-tab
              v-for="format in store.formats[index]"
              :key="format.name"
              v-bind="format"
              style="
                background-color: rgba(24, 169, 226, 0.2);
                padding: 0 10px;
                border-radius: 10px;
                color: #2375a9;
                min-height: 0px;
                height: 20px;
                margin-right: 3px;
                max-width: 120px;
              "
            />
          </q-tabs>
        </div>
        <div
          v-if="!$q.screen.lt.sm"
          @click="showDetails(book)"
          class="col text-right authors q-mr-xl"
        >
          <span style="color: #5b5b5b; font-size: 12px">{{
            store.authors_books[index]
          }}</span>
        </div>
      </div>
    </q-card>

    <div class="col-12 q-pb-sm row justify-center items-end">
      <q-btn
        dense
        outline
        :disable="
          store.current_page_literary_works === 1 ||
          store.current_page_literary_works === 0
        "
        flat
        round
        style="color: #2375a9"
        icon="first_page"
        @click="getData('first')"
      />
      <q-btn
        dense
        outline
        flat
        round
        :disable="
          store.current_page_literary_works === 1 ||
          store.current_page_literary_works === 0
        "
        style="color: #2375a9"
        @click="getData('back')"
        icon="chevron_left"
      />
      <q-badge>
        {{ store.current_page_literary_works }}/{{
          store.total_pages_literary_works
        }}
      </q-badge>
      <q-btn
        dense
        :disable="
          store.current_page_literary_works ===
            store.total_pages_literary_works ||
          store.total_pages_literary_works === 0
        "
        outline
        flat
        round
        style="color: #2375a9"
        icon="chevron_right"
        @click="getData('next')"
      />
      <q-btn
        dense
        outline
        :disable="
          store.current_page_literary_works ===
            store.total_pages_literary_works ||
          store.total_pages_literary_works === 0
        "
        flat
        round
        style="color: #2375a9"
        icon="last_page"
        @click="getData('last')"
      />
    </div>
  </div>

  <details-modal
    :show="show_details"
    @close="show_details.show = false"
  ></details-modal>
</template>

<script>
import { ref } from "vue";
import DetailsModal from "./DetailsModal.vue";
import { useCounterStore } from "../../stores/example-store";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

export default {
  name: "ResultsList",
  components: {
    DetailsModal,
  },
  setup() {
    const store = useCounterStore();
    const $q = useQuasar();
    const authors_books = ref([]);
    const show_details = ref({
      show: false,
      object: {},
    });
    $q.screen.setSizes({ sm: 721 });
    function showDetails(obj) {
      let names = "";
      obj.autores.forEach((autor) => {
        names += autor.nombre + ", ";
      });
      show_details.value.show = true;
      show_details.value.authors_names = names.substring(0, names.length - 2);
      show_details.value.object = obj;
    }

    async function getData(page) {
      if (page === "next") {
        store.current_page_literary_works++;
      } else if (page === "back") {
        store.current_page_literary_works--;
      } else if (page === "first") {
        store.current_page_literary_works = 1;
      } else {
        store.current_page_literary_works = store.total_pages_literary_works;
      }
      //TODO: esta funcion tengo que hacerla un composable porque la uso en dos componentes
      store.loading_filter_data = true;
      store.no_results = false;
      let tematicas = [];
      let formato = null;
      let authors = [];
      let is_author = true;
      store.filter_list_toolbar_copy.forEach((item) => {
        store.filter_list[0].forEach((tematica) => {
          if (tematica.nombre === item.nombre) {
            is_author = false;
            tematicas.push(tematica.id);
          }
        });
        store.filter_list[1].forEach((format) => {
          //TODO: esto sustituirlo por un while para hacer la busqueda mas optima
          formato = format.chk ? format.id : formato;
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
        page: store.current_page_literary_works,
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
    }

    function getFrontImage(param) {
      return `${process.env.API}/storage/${param.portada}`;
    }
    return {
      getFrontImage,
      authors_books,
      getData,
      show_details,
      showDetails,
      store,
    };
  },
};
</script>

<style scoped>
.book-card-col {
  width: 100%;
  height: auto;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  min-width: 142px;
  transition: all 0.4s ease;
}
.book-card-col:hover {
  transform: translateY(-3%);
  box-shadow: 0 6px 10px -2px rgb(0 0 0 / 20%), 0 10px 16px rgb(0 0 0 / 14%),
    0 2px 28px rgb(0 0 0 / 12%);
}
.div-card {
  width: 44%;
  max-width: 271px;
}
.book-card-row {
  width: 100%;
  height: 50px;
  background-color: white;
  cursor: pointer;
  transition: all 0.4s ease;
}
.book-card-row:hover {
  transform: translateY(-3%);
  box-shadow: 0 4px 7px -2px rgb(0 0 0 / 20%), 0 6px 12px rgb(0 0 0 / 14%),
    0 2px 20px rgb(0 0 0 / 12%);
}
.my-padding {
  padding-bottom: 3px;
}
.summary {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.authors {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.q-badge {
  background-color: #2375a9 !important;
  color: #fff;
  line-height: 27px;
}
.empty-results {
  color: rgba(91, 91, 91, 0.6);
  font-size: 20px;
}
.empty-results-mobile {
  color: rgba(91, 91, 91, 0.6);
  font-size: 0.6em !important;
}
.own-format {
  font-weight: bold;
  border: 2px solid;
}
.card-obra-colum {
  font-size: 0.9em !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}
.card-obra-row {
  font-size: 0.9em !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.card-obra-row-row {
  height: 6em !important;
}
.card-obra-row-img {
  height: 6em !important;
}
.card-obra-row-title {
  font-size: 1em !important;
  font-weight: bold !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}
.card-obra-row-authors {
  font-size: 0.9em !important;
}
.card-obra-row-title-col {
  height: 6em !important;
  align-content: center !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  margin-left: 0.4em !important;
}
.card-obra-colum-separator {
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}
.card-obra-colum-authors {
  font-size: 0.7em !important;
}
.empty-result-mobile-icon {
  font-size: 2.7em !important;
}
</style>
