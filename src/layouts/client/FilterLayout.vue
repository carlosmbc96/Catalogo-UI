<template>
  <q-layout view="lhh lpr lff">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey tab-general"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="literary_works" label="Obras" />
      <q-tab :disable="emptyAuthors" name="authors" label="Autores" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <!-- Obras tab -->
      <q-tab-pane name="literary_works">
        <q-header v-if="!$q.screen.lt.sm && !$q.screen.lt.md" class="header">
          <q-toolbar style="margin-left: 32px">
            <div
              style="display: contents"
              v-if="
                store.leftDrawerOpen /* && !$q.screen.lt.sm && !$q.screen.lt.md */
              "
            >
              <div v-if="filtersEmpty()" class="q-pa-xs q-gutter-md">
                <q-btn
                  style="
                    background-color: #2375a9;
                    border-radius: 5px;
                    height: 33px;
                  "
                  icon-right="close"
                  label="Filtros"
                  size="sm"
                  @click="resetFilters"
                  :ripple="false"
                  unelevated
                />
                <q-btn
                  v-for="(filter, i) in store.filter_list_toolbar_copy"
                  :key="i"
                  style="
                    background-color: #2376a957;
                    color: #2375a9;
                    border-radius: 5px;
                    height: 33px;
                  "
                  icon-right="close"
                  size="sm"
                  @click="deleteFilter(filter.nombre)"
                  :label="filter.nombre"
                  :ripple="false"
                  unelevated
                />
              </div>
              <div v-else class="filters-empty">
                Aquí aparecerán las etiquetas de filtros que aplique...
              </div>
            </div>
            <!-- <div style="display: contents" v-else-if="$q.screen.lt.md">
              <div v-if="filtersEmptyMobile()" class="q-pa-xs q-gutter-md">
                <q-btn
                  style="
                    background-color: #2375a9;
                    border-radius: 5px;
                    height: 33px;
                  "
                  icon-right="close"
                  label="Filtros"
                  size="sm"
                  @click="resetFilters"
                  :ripple="false"
                  unelevated
                />
                <q-btn
                  v-for="(filter, i) in store.filter_list_toolbar_copy_mobile"
                  :key="i"
                  style="
                    background-color: #2376a957;
                    color: #2375a9;
                    border-radius: 5px;
                    height: 33px;
                  "
                  icon-right="close"
                  size="sm"
                  @click="deleteFilter(filter.nombre)"
                  :label="filter.nombre"
                  :ripple="false"
                  unelevated
                />
                >
              </div>
              <div v-else class="filters-empty">
                Aquí aparecerán las etiquetas de filtros que aplique...
              </div>
            </div> -->
          </q-toolbar>
        </q-header>

        <q-card
          id="modal-movil"
          :style="store.leftDrawerOpen ? 'top: 0' : ''"
          v-if="$q.screen.lt.sm"
          class="filters-mobile row justify-start"
        >
          <div
            v-if="$q.screen.lt.sm && store.leftDrawerOpen"
            class="btns-action-mobile"
          >
            <q-btn
              label="Aplicar"
              @click="filterMobile"
              unelevated
              no-caps
              class="fixed-top"
              :class="store.leftDrawerOpen ? 'opacity' : ''"
              style="
                margin-top: 5em;
                width: 40vw;
                background: rgb(34, 119, 170);
                color: white;
                border-radius: 10px;
                margin-right: auto;
                margin-left: 1em;
                margin-bottom: 0.2em;
              "
            />
            <q-btn
              label="Limpiar"
              @click="clearFilters"
              unelevated
              no-caps
              class="fixed-top"
              :class="store.leftDrawerOpen ? 'opacity' : ''"
              style="
                margin-top: 5em;
                margin-left: auto;
                width: 40vw;
                background: rgb(34, 119, 170);
                color: white;
                margin-right: 1em;
                border-radius: 10px;
                margin-bottom: 0.2em;
              "
            />
          </div>
          <div
            class="col-12"
            style="
              margin-top: 7.5em;
              height: fit-content;
              border-bottom: 1px solid #5b5b5ba1;
              padding: 8px 0px;
            "
          >
            <q-icon class="icon-filter-mobile" name="import_export" />
            <span class="title-section-filter-mobile">Ordenar</span>
            <div style="margin-top: 0.3em" class="col-12 q-gutter-x-md">
              <q-checkbox
                @click="store.order_selection_literary_woks = 'A - Z'"
                class="filters-mobile-option"
                label="A - Z"
                :class="
                  store.order_selection_literary_woks === 'A - Z'
                    ? 'filters-mobile-option-selected'
                    : ''
                "
              />
              <q-checkbox
                @click="store.order_selection_literary_woks = 'Z - A'"
                class="filters-mobile-option"
                label="Z - A"
                :class="
                  store.order_selection_literary_woks === 'Z - A'
                    ? 'filters-mobile-option-selected'
                    : ''
                "
              />
            </div>
          </div>
          <div
            class="col-12"
            style="
              margin-top: 1em;
              border-bottom: 1px solid #5b5b5ba1;
              padding: 8px 0px;
            "
          >
            <q-icon class="icon-filter-mobile" name="auto_stories" />
            <span class="title-section-filter-mobile">Por Tématica</span>
            <div style="margin-top: 0.3em" class="col-12 q-gutter-x-md">
              <q-checkbox
                @click="addFilter('tematic', null, 'mobile')"
                class="filters-mobile-option"
                :class="
                  filter_option.chk ? 'filters-mobile-option-selected' : ''
                "
                v-for="(filter_option, i) in store.filter_list_mobile[0]"
                :key="i"
                v-model="filter_option.chk"
                :label="filter_option.nombre"
              />
            </div>
          </div>
          <div
            class="col-12"
            style="
              margin-top: 1em;
              border-bottom: 1px solid #5b5b5ba1;
              padding: 8px 0px;
            "
          >
            <q-icon class="icon-filter-mobile" name="style" />
            <span class="title-section-filter-mobile">Por Formato</span>
            <div style="margin-top: 0.3em" class="col-12 q-gutter-x-md">
              <q-checkbox
                :class="
                  filter_option.chk ? 'filters-mobile-option-selected' : ''
                "
                @click="addFilter('format', filter_option.nombre, 'mobile')"
                class="filters-mobile-option"
                v-for="(filter_option, i) in store.filter_list_mobile[1]"
                :key="i"
                v-model="filter_option.chk"
                :label="filter_option.nombre"
              />
            </div>
          </div>
          <div
            class="col-12"
            style="margin-top: 1em; padding: 8px 0px; margin-bottom: 5em"
          >
            <q-icon class="icon-filter-mobile" name="person" />
            <span class="title-section-filter-mobile">Por Autores</span>
            <q-input
              style="margin-top: 0.3em"
              :loading="loading"
              @keyup="filterAuthor"
              class="filter-author-mobile"
              v-model="authors_filtered"
              outlined
              type="text"
            />
            <q-checkbox
              v-for="(author, i) in authors_selected"
              :key="i"
              class="filters-mobile-option-selected filters-mobile-option"
              :label="author.nombre"
              style="margin-top: 0.6em; margin-right: 1.5em"
            />

            <q-checkbox
              v-for="(author, i) in authors_options_mobile"
              :key="i"
              :class="author.chk ? 'filters-mobile-option-selected' : ''"
              @click="addFilter('author', i, 'mobile')"
              class="filters-mobile-option"
              :label="author.nombre"
              v-model="author.chk"
              style="margin-top: 0.6em; margin-right: 1.5em"
            />
          </div>
        </q-card>

        <q-drawer
          id="drawer-tablet"
          :style="store.leftDrawerOpen ? 'top: 0' : ''"
          v-else-if="$q.screen.lt.md"
          class="filters-mobile row justify-start"
          v-model="store.leftDrawerOpen"
          side="right"
        >
          <div class="btns-action-tablet">
            <q-btn
              label="Aplicar"
              @click="filterMobile"
              unelevated
              no-caps
              class="fixed-top"
              style="
                margin-top: 5em;
                width: 10vw;
                background: rgb(34, 119, 170);
                color: white;
                border-radius: 10px;
                margin-right: auto;
                margin-left: 1em;
                margin-bottom: 0.2em;
              "
            />
            <q-btn
              label="Limpiar"
              @click="clearFilters"
              unelevated
              no-caps
              class="fixed-top"
              style="
                margin-top: 5em;
                margin-left: auto;
                width: 10vw;
                background: rgb(34, 119, 170);
                color: white;
                margin-right: 1em;
                border-radius: 10px;
                margin-bottom: 0.2em;
              "
            />
          </div>
          <div
            class="col-12"
            style="
              margin-top: 120px;
              height: fit-content;
              border-bottom: 1px solid #5b5b5ba1;
              padding: 8px 0px;
            "
          >
            <q-icon class="icon-filter-tablet" name="import_export" />
            <span class="title-section-filter-mobile">Ordenar</span>
            <div style="margin-top: 0.3em" class="col-12">
              <q-checkbox
                @click="store.order_selection_literary_woks = 'A - Z'"
                class="filters-tablet-option"
                label="A - Z"
                :class="
                  store.order_selection_literary_woks === 'A - Z'
                    ? 'filters-mobile-option-selected'
                    : ''
                "
              />
              <q-checkbox
                @click="store.order_selection_literary_woks = 'Z - A'"
                class="filters-tablet-option"
                label="Z - A"
                :class="
                  store.order_selection_literary_woks === 'Z - A'
                    ? 'filters-mobile-option-selected'
                    : ''
                "
              />
            </div>
          </div>
          <div
            class="col-12"
            style="
              margin-top: 1em;
              border-bottom: 1px solid #5b5b5ba1;
              padding: 8px 0px;
            "
          >
            <q-icon class="icon-filter-tablet" name="auto_stories" />
            <span class="title-section-filter-mobile">Por Tématica</span>
            <div style="margin-top: 0.3em" class="col-12">
              <q-checkbox
                @click="addFilter('tematic', null, 'mobile')"
                class="filters-tablet-option"
                :class="
                  filter_option.chk ? 'filters-mobile-option-selected' : ''
                "
                v-for="(filter_option, i) in store.filter_list_mobile[0]"
                :key="i"
                v-model="filter_option.chk"
                :label="filter_option.nombre"
              />
            </div>
          </div>
          <div
            class="col-12"
            style="
              margin-top: 1em;
              border-bottom: 1px solid #5b5b5ba1;
              padding: 8px 0px;
            "
          >
            <q-icon class="icon-filter-tablet" name="style" />
            <span class="title-section-filter-mobile">Por Formato</span>
            <div style="margin-top: 0.3em" class="col-12">
              <q-checkbox
                :class="
                  filter_option.chk ? 'filters-mobile-option-selected' : ''
                "
                @click="addFilter('format', filter_option.nombre, 'mobile')"
                class="filters-tablet-option"
                v-for="(filter_option, i) in store.filter_list_mobile[1]"
                :key="i"
                v-model="filter_option.chk"
                :label="filter_option.nombre"
              />
            </div>
          </div>
          <div
            class="col-12"
            style="margin-top: 1em; padding: 8px 0px; margin-bottom: 5em"
          >
            <q-icon class="icon-filter-tablet" name="person" />
            <span class="title-section-filter-mobile">Por Autores</span>
            <q-input
              style="
                margin-top: 0.3em;
                background-color: rgb(239, 243, 246) !important;
              "
              :loading="loading"
              @keyup="filterAuthor"
              class="filter-author-tablet"
              v-model="authors_filtered"
              outlined
              type="text"
            />
            <q-checkbox
              v-for="(author, i) in authors_selected"
              :key="i"
              class="filters-mobile-option-selected filters-tablet-option"
              :label="author.nombre"
              style="margin-top: 0.6em; margin-right: 1.5em"
            />

            <q-checkbox
              v-for="(author, i) in authors_options_mobile"
              :key="i"
              :class="author.chk ? 'filters-mobile-option-selected' : ''"
              @click="addFilter('author', i, 'mobile')"
              class="filters-tablet-option"
              :label="author.nombre"
              v-model="author.chk"
              style="margin-top: 0.6em; margin-right: 1.5em"
            />
          </div>
        </q-drawer>

        <q-drawer
          v-if="!$q.screen.lt.md"
          v-model="store.leftDrawerOpen"
          side="left"
          style="min-height: 100vh; max-height: 100vh"
        >
          <div class="filters">
            <div
              style="
                padding-left: 72px;
                font-size: 16px;
                color: #5b5b5b;
                height: 57.5px;
                align-items: center;
                display: flex;
              "
            >
              <q-icon name="filter_alt" class="icon-layout" />
              Filtros
              <q-btn
                v-if="store.leftDrawerOpen"
                dense
                style="color: #5b5b5b; margin-left: 115px"
                flat
                round
                icon="west"
                @click="store.leftDrawerOpen = !store.leftDrawerOpen"
              />
            </div>
            <q-expansion-item
              class="filtros-zeplin"
              :v-model="filter_expansion_tematica"
              icon="auto_stories"
              label="Por temática"
            >
              <q-card
                v-for="(filter_option, i) in store.filter_list[0]"
                :key="i"
              >
                <q-card-section class="row">
                  <q-checkbox
                    @click="addFilter('tematic', null, 'pc')"
                    size="xs"
                    class="col-12 opciones-filtros-zeplin"
                    v-model="filter_option.chk"
                    :label="filter_option.nombre"
                  />
                </q-card-section>
              </q-card>
              <q-separator class="q-mt-sm" />
            </q-expansion-item>

            <q-expansion-item
              class="filtros-zeplin"
              :v-model="filter_expansion_formato"
              icon="style"
              label="Por formato"
            >
              <q-card
                v-for="(filter_option, i) in store.filter_list[1]"
                :key="i"
              >
                <q-card-section class="row">
                  <q-checkbox
                    @click="addFilter('format', filter_option.nombre, 'pc')"
                    size="xs"
                    class="col-12 opciones-filtros-zeplin"
                    v-model="filter_option.chk"
                    :label="filter_option.nombre"
                  />
                </q-card-section>
              </q-card>
              <q-separator class="q-mt-sm" />
            </q-expansion-item>

            <q-expansion-item
              class="filtros-zeplin"
              :v-model="filter_expansion_tipo_libro"
              icon="person"
              label="Por autores"
            >
              <q-input
                :loading="loading"
                @keyup="filterAuthor('pc')"
                class="filter-author"
                v-model="authors_filtered"
                outlined
                type="text"
              />
              <q-card v-for="(author, i) in authors_list_pc_filter" :key="i">
                <q-card-section class="row">
                  <q-checkbox
                    @click="addFilter('author', i, 'pc')"
                    size="xs"
                    class="col-12 opciones-filtros-zeplin"
                    v-model="author.chk"
                    :label="author.nombre"
                  />
                </q-card-section>
              </q-card>
              <q-separator class="q-mt-sm" />
            </q-expansion-item>
          </div>
        </q-drawer>

        <q-page-container>
          <order-bar tab="literary_works" id="order-bar"></order-bar>
          <results-list></results-list>
        </q-page-container>
      </q-tab-pane>
      <!-- Autores tab -->
      <q-tab-pane name="authors">
        <q-page-container>
          <order-bar tab="authors" id="order-bar"></order-bar>
          <authors-tab></authors-tab>
        </q-page-container>
      </q-tab-pane>
    </q-tab-panels>
  </q-layout>
</template>

<script>
import { ref, onBeforeMount, computed } from "vue";
import OrderBar from "../../components/client/OrderBar.vue";
import ResultsList from "../../components/client/ResultsList.vue";
import AuthorsTab from "../../components/client/AuthorsTab.vue";
import { api } from "boot/axios";
import { useCounterStore } from "../../stores/example-store";
import { useQuasar } from "quasar";

export default {
  name: "FilterLayout",
  components: {
    OrderBar,
    ResultsList,
    AuthorsTab,
  },
  setup() {
    const $q = useQuasar();
    const tab = ref("literary_works");
    const authors_selected = ref([]);
    const authors_list = ref([]);
    const authors_list_pc = ref([]);
    const authors_list_pc_filter = ref([]);
    const emptyAuthors = ref(false);
    const loading = ref(false);
    const authors_filtered = ref("");
    const authors_options = ref([]);
    const authors_options_mobile = ref([]);
    const store = useCounterStore();
    const filter_list_toolbar = ref([]);
    const filter_list_toolbar_mobile = ref([]);
    const filter_expansion_tematica = ref(false);
    const filter_expansion_formato = ref(false);
    const filter_expansion_tipo_libro = ref(false);
    const filter_list_toolbar_copy = ref([]);
    const view_mode_results = store.leftDrawerOpen ? ref(false) : ref(true);
    $q.screen.setSizes({ sm: 721 });

    onBeforeMount(async () => {
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const tematicas = await api.post(`/tematicas`, json);
        tematicas.data.forEach((tematica) => {
          tematica.chk = false;
        });
        store.filter_list.push(JSON.parse(JSON.stringify(tematicas.data)));
        store.filter_list_mobile.push(
          JSON.parse(JSON.stringify(tematicas.data))
        );
      } catch (error) {
        console.log(error);
      }
      try {
        authors_list.value = await api.post(`/autores`, json);
        emptyAuthors.value =
          authors_list.value.data.length !== 0 ? false : true;
        authors_list_pc.value = JSON.parse(
          JSON.stringify(authors_list.value.data)
        );
        authors_list_pc_filter.value = JSON.parse(
          JSON.stringify(authors_list_pc.value)
        );
        authors_list_pc_filter.value.forEach((auhor) => {
          auhor.chk = false;
        });
        authors_list_pc.value.forEach((auhor) => {
          auhor.chk = false;
        });
      } catch (error) {
        console.log(error);
      }
      const formatos = await api.post(`/tiposTrabajo`, json);
      try {
        formatos.data.forEach((formato) => {
          formato.chk = false;
        });
        store.filter_list.push(JSON.parse(JSON.stringify(formatos.data)));
        store.filter_list_mobile.push(
          JSON.parse(JSON.stringify(formatos.data))
        );
      } catch (error) {
        console.log(error);
      }
    });

    function clearFilters() {
      store.filter_list_toolbar_copy_mobile = [];
      authors_selected.value = [];
      store.search_input = "";
      store.filter_list_mobile[0].forEach((el) => {
        el.chk = false;
      });
      store.filter_list_mobile[1].forEach((el) => {
        el.chk = false;
      });
      filterMobile();
    }

    function resetFilters() {
      store.loading_filter_data = true;
      store.filter_list_toolbar_copy = [];
      store.filter_list.forEach((filter) => {
        filter.forEach((option) => {
          option.chk = false;
        });
      });
      authors_list_pc_filter.value.forEach((option) => {
        option.chk = false;
      });
      filter();
    }
    function filtersEmpty() {
      return store.filter_list_toolbar_copy.length === 0 ? false : true;
    }
    function filtersEmptyMobile() {
      return store.filter_list_toolbar_copy_mobile.length === 0 ? false : true;
    }
    function addFilter(type_f, value, type_dispositive) {
      if (type_dispositive === "mobile") {
        authors_selected.value = [];
        filter_list_toolbar_mobile.value = [];
      }
      filter_list_toolbar.value = [];

      if (type_f === "format" && type_dispositive === "pc") {
        store.filter_list[1].forEach((format) => {
          if (format.nombre === value) {
            format.chk = true;
          } else format.chk = false;
        });
      } else if (type_f === "format" && type_dispositive === "mobile") {
        store.filter_list_mobile[1].forEach((format) => {
          if (format.nombre === value) {
            format.chk = true;
          } else format.chk = false;
        });
      }
      if (type_f === "author" && type_dispositive === "pc") {
        let count = 0;
        let exist = false;
        if (store.filter_list_toolbar_copy.length !== 0) {
          for (
            let index = 0;
            index < store.filter_list_toolbar_copy.length;
            index++
          ) {
            if (store.filter_list_toolbar_copy[index].correo) {
              count = 1;
              if (
                store.filter_list_toolbar_copy[index].nombre !==
                authors_list_pc_filter.value[value].nombre
              ) {
                filter_list_toolbar.value.push(
                  store.filter_list_toolbar_copy[index]
                );
              } else {
                authors_list_pc_filter.value[value].chk = false;
                store.filter_list_toolbar_copy.slice(index, 1);
                exist = true;
              }
            }
          }
          if ((count = 1 && !exist)) {
            filter_list_toolbar.value.push(authors_list_pc_filter.value[value]);
          } else if (count === 0) {
            filter_list_toolbar.value.push(authors_list_pc_filter.value[value]);
          }
        } else {
          filter_list_toolbar.value.push(authors_list_pc_filter.value[value]);
        }
      } else if (type_f === "author" && type_dispositive === "mobile") {
        let count = 0;
        let exist = false;
        for (
          let index = 0;
          index < store.filter_list_toolbar_copy_mobile.length;
          index++
        ) {
          if (store.filter_list_toolbar_copy_mobile[index].type === "author") {
            count = 1;
            if (
              store.filter_list_toolbar_copy_mobile[index].nombre !==
              authors_options_mobile.value[value].nombre
            ) {
              filter_list_toolbar_mobile.value.push(
                store.filter_list_toolbar_copy_mobile[index]
              );
              authors_selected.value.push(
                store.filter_list_toolbar_copy_mobile[index]
              );
            } else {
              filter_list_toolbar_mobile.value.push(
                authors_options_mobile.value[value]
              );
              exist = true;
            }
          }
        }
        if ((count = 1 && !exist)) {
          filter_list_toolbar_mobile.value.push(
            authors_options_mobile.value[value]
          );
          authors_selected.value.push(authors_options_mobile.value[value]);
        } else if (exist) {
          authors_selected.value.push(authors_options_mobile.value[value]);
        } else if (count === 0) {
          filter_list_toolbar_mobile.value.push(
            authors_options_mobile.value[value]
          );
          authors_selected.value.push(authors_options_mobile.value[value]);
        }
        authors_options_mobile.value = [];
        authors_filtered.value = "";
      }
      if (type_dispositive === "pc") {
        store.filter_list.forEach((filter) => {
          filter.forEach((option) => {
            if (option.chk) {
              filter_list_toolbar.value.push(option);
            }
          });
        });
        if (type_f !== "author") {
          store.filter_list_toolbar_copy.forEach((element) => {
            if (element.correo) {
              filter_list_toolbar.value.push(element);
            }
          });
        }
      } else if (type_dispositive === "mobile") {
        store.filter_list_mobile.forEach((filter) => {
          filter.forEach((option) => {
            if (option.chk) {
              filter_list_toolbar_mobile.value.push(option);
            }
          });
        });
      }
      if (type_dispositive === "mobile" && type_f !== "author") {
        store.filter_list_toolbar_copy_mobile.forEach((el) => {
          if (el.type === "author") {
            filter_list_toolbar_mobile.value.push(el);
            authors_selected.value.push(el);
          }
        });
      }
      if (type_dispositive === "pc") {
        store.filter_list_toolbar_copy = filter_list_toolbar.value;
      } else {
        store.filter_list_toolbar_copy_mobile =
          filter_list_toolbar_mobile.value;
      }
      authors_filtered.value = "";
      filterAuthor("pc");
      if (type_dispositive === "pc") {
        filter();
      }
    }

    async function filterMobile() {
      store.loading_filter_data = true;
      store.leftDrawerOpen = false;
      store.no_results = false;
      let tematicas = [];
      let formato = null;
      let authors = [];
      store.filter_list_toolbar_copy_mobile.forEach((item) => {
        let is_author = true;
        store.filter_list_mobile[0].forEach((tematica) => {
          //TODO: esto sustituirlo por un while para hacer la busqueda mas optima
          if (tematica.nombre === item.nombre) {
            is_author = false;
            tematicas.push(item.id);
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
      filter_list_toolbar_mobile.value = [];

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
    }

    async function filter() {
      store.loading_filter_data = true;
      store.no_results = false;
      let tematicas = [];
      let formato = null;
      let authors = [];
      store.filter_list_toolbar_copy.forEach((item) => {
        let is_author = true;
        store.filter_list[0].forEach((tematica) => {
          //TODO: esto sustituirlo por un while para hacer la busqueda mas optima
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
      /*  filter_list_toolbar.value = []; */

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
    }

    function deleteFilter(option_p) {
      store.loading_filter_data = true;
      const filters_tool = store.filter_list_toolbar_copy.filter((ft) => {
        return ft.nombre !== option_p;
      });
      store.filter_list_toolbar_copy = filters_tool;
      store.filter_list.forEach((filter) => {
        filter.forEach((option) => {
          if (option.nombre === option_p) {
            option.chk = false;
          }
        });
      });
      authors_list_pc_filter.value.forEach((option) => {
        if (option.nombre === option_p) {
          option.chk = false;
        }
      });
      filter();
    }
    async function filterAuthor(type_dispositive) {
      if (type_dispositive === "pc") {
        if (authors_filtered.value === "" || authors_filtered.value === null) {
          authors_list_pc_filter.value = authors_list_pc.value;
          store.filter_list_toolbar_copy.forEach((element) => {
            if (element.correo) {
              let i = 0;
              let found = false;
              while (!found && i < authors_list_pc_filter.value.length) {
                if (element.id) {
                  if (authors_list_pc_filter.value[i].id === element.id) {
                    authors_list_pc_filter.value[i].chk = true;
                    found = true;
                  }
                }
                i++;
              }
            }
          });
          return;
        }
        const needle = authors_filtered.value.toLowerCase();
        authors_list_pc_filter.value = authors_list_pc.value.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
        store.filter_list_toolbar_copy.forEach((element) => {
          if (element.correo) {
            let i = 0;
            let found = false;
            while (!found && i < authors_list_pc_filter.value.length) {
              if (element.id) {
                if (authors_list_pc_filter.value[i].id === element.id) {
                  authors_list_pc_filter.value[i].chk = true;
                  found = true;
                }
              }
              i++;
            }
          }
        });
      } else {
        const input =
          authors_filtered.value !== "" ? authors_filtered.value : null;
        try {
          const response = await api.get(`/autores/filtrarPorNombre/${input}`);
          authors_options_mobile.value = response.data;
          authors_options_mobile.value.forEach((author) => {
            author.chk = false;
            author.type = "author";
          });
        } catch (error) {
          console.log(error);
        } finally {
        }
      }
    }

    return {
      store,
      emptyAuthors,
      filterMobile,
      authors_list_pc,
      tab,
      authors_selected,
      authors_list_pc_filter,
      clearFilters,
      filter_expansion_formato,
      filter_expansion_tipo_libro,
      filter_expansion_tematica,
      filtersEmpty,
      filtersEmptyMobile,
      view_mode_results,
      loading,
      resetFilters,
      deleteFilter,
      addFilter,
      filter_list_toolbar,
      filter_list_toolbar_mobile,
      filter_list_toolbar_copy,
      authors_filtered,
      authors_options,
      authors_options_mobile,
      filterAuthor,
    };
  },
};
</script>
<style scoped>
.opacity {
  opacity: 1 !important;
}
.filters-mobile-option {
  height: 3em;
  min-width: 6em;
  background: white;
  color: #5b5b5b;
  border: 1px solid #5b5b5b;
  justify-content: center;
  width: auto;
  margin-top: 0.5em;
  font-size: 0.7em;
  border-radius: 5px;
}
.filters-tablet-option {
  height: 3em;
  min-width: 6em;
  background: white;
  color: #5b5b5b;
  border: 1px solid #5b5b5b;
  justify-content: center;
  width: auto;
  margin-top: 0.5em;
  font-size: 0.7em;
  border-radius: 5px;
  margin-left: 16px;
  padding: 0px 5px !important;
}
.filters-mobile-option-selected {
  background: #3b95cd0f;
  color: #2277aa;
  border: 1px solid #2277aa;
  font-weight: bold;
}
.title-section-filter-mobile {
  font-size: 1.1em;
  color: #2277aa;
  font-weight: 600;
}
.icon-filter-mobile {
  font-size: 1.5em;
  color: #2277aa;
  margin-right: 0.6em;
}
.icon-filter-tablet {
  font-size: 1.5em;
  color: #2277aa;
  margin-right: 0.6em;
  margin-left: 16px;
}
.filters-mobile {
  height: 100vh;
  width: 100vw;
  background: rgb(239, 243, 246);
  border-radius: 10px;
  position: fixed;
  top: -100vh;
  z-index: 1;
  padding: 1em;
  overflow: auto;
  transition: top 0.4s ease;
}
.header {
  background-color: #eff3f6 !important;
}
.filters .q-card__section--vert {
  padding: 0 !important;
  margin-left: 41px;
}
.filters .q-checkbox__label .q-anchor--skip {
  margin-left: 22px !important;
}
.filtros-zeplin {
  font-size: 14px;
  color: #2375a9;
  font-weight: 600;
}
.opciones-filtros-zeplin {
  color: rgba(0, 0, 0, 0.7);
  font-size: 14px;
  font-weight: 100;
}
.scroll::-webkit-scrollbar:vertical {
  width: 3px !important;
}

.scroll::-webkit-scrollbar-button:increment,
.scroll::-webkit-scrollbar-button {
  display: none !important;
}

.scroll::-webkit-scrollbar-thumb {
  background-color: #5b5b5b !important;
  border-radius: 100px !important;
}

.scroll::-webkit-scrollbar-track {
  border-radius: 100px !important;
}
.filter-author {
  background-color: rgb(239, 243, 246);
  margin-left: 49px;
  width: 200px;
  border-radius: 10px;
}
.filter-author-mobile {
  background-color: white;
  height: 3em;
  border-radius: 10px;
}
.filter-author-tablet {
  height: 3em;
  border-radius: 10px;
  margin-left: 16px;
  margin-right: 16px;
}
.btns-action-tablet {
  height: 60px !important;
  margin-top: 60px;
  width: 100% !important;
  position: fixed !important;
  display: flex;
  background: white;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 0px 8px #0000003d;
  justify-content: flex-end;
  z-index: 10000;
}
.btns-action-mobile {
  height: 60px !important;
  top: 60px;
  width: 100% !important;
  position: fixed !important;
  display: flex;
  background: white;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 0px 8px #0000003d;
  justify-content: flex-end;
  z-index: 10000;
  right: 0;
}
</style>
