<template>
  <q-layout view="lHh lpR lFf" class="admin-menu">
    <q-header class="bg-white text-black" elevated>
      <q-toolbar>
        <q-btn
          v-if="$q.screen.lt.md"
          dense
          flat
          text-color="grey-14"
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />
        <q-btn
          v-else
          dense
          flat
          text-color="grey-14"
          round
          icon="menu"
          @click="toggleLeftDrawerMini"
        />
        <q-space />
        <q-chip style="cursor: pointer">
          <q-avatar>
            <q-btn
              round
              text-color="grey-14"
              icon="account_circle"
              flat
              no-caps
              no-wrap
            >
            </q-btn>
          </q-avatar>
          {{ user.user.name }}
          <q-menu class="q-mr-md">
            <div>
              <q-btn @click="logout()" text-color="grey-14" icon="logout">
                <q-tooltip>Salir</q-tooltip>
              </q-btn>
            </div>
          </q-menu>
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer
      style="background-color: #2277aa"
      class="drawer-admin"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      elevated
      :mini="miniDrawer"
    >
      <div class="row justify-center" style="height: 100vh; display: block">
        <q-img
          v-if="!miniDrawer"
          class="col-12"
          no-spinner
          src="~assets/LOGO_BLANCO_3x.webp"
          height="100px"
          fit="contain"
        />
        <q-img
          v-else
          class="mini"
          no-spinner
          src="~assets/LOGO_BLANCO_mini.svg"
          height="100px"
          fit="contain"
        />
        <q-scroll-area
          :thumb-style="thumbStyle"
          :style="'height:' + ($q.screen.height - 100) + 'px !important'"
        >
          <div>
            <div
              class="col-12 q-mt-xs"
              v-for="(item, index) in menu_options"
              :key="index"
            >
              <q-item
                v-if="item.childrens.length === 0"
                dense
                v-show="checkPermission(item.code)"
                active-class="bg-grey-7 text-grey-1"
                clickable
                v-ripple
                :to="{ name: item.link }"
              >
                <q-tooltip
                  v-if="miniDrawer"
                  anchor="center right"
                  self="center left"
                >
                  {{ item.text }}
                </q-tooltip>
                <q-item-section avatar>
                  <q-icon color="white" :name="item.icon" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.text }}</q-item-label>
                  <q-item-label caption>{{ item.caption }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-expansion-item
                v-else
                :icon="item.icon"
                :label="item.text"
                v-show="checkPermission(item.code)"
                :caption="item.caption"
              >
                <q-item
                  :to="{ name: submenu.link }"
                  class="q-ml-md"
                  v-show="checkPermission(submenu.code)"
                  v-for="(submenu, index) in item.childrens"
                  :key="index"
                  v-ripple
                  clickable
                >
                  <q-tooltip
                    v-if="miniDrawer"
                    anchor="center right"
                    self="center left"
                  >
                    {{ submenu.text }}
                  </q-tooltip>
                  <q-item-section avatar>
                    <q-icon color="white" :name="submenu.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ submenu.text }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container class="admin-style" style="overflow: auto; height: 100vh">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onBeforeMount, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import { useCounterStore } from "../../stores/example-store";

export default {
  setup() {
    const $q = useQuasar();
    const store = useCounterStore();
    const user = ref({});
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const miniDrawer = ref(false);
    const menu_options = ref([
      {
        icon: "folder",
        text: "Expedientes",
        caption: "Consulta de expedientes",
        childrens: [],
        link: "adminExpedients",
        code: ["02", "01"],
      },
      {
        icon: "import_contacts",
        text: "Obras",
        caption: "Gestión de obras",
        childrens: [],
        link: "adminLiteraryWorks",
        code: ["03", "04"],
      },

      {
        icon: "people",
        text: "Autores",
        caption: "Gestión de autores",
        childrens: [],
        link: "adminAuthors",
        code: ["05", "06"],
      },
      {
        icon: "reorder",
        text: "Datos de Obra",
        caption: "Gestión de datos...",
        code: [
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
        ],
        childrens: [
          {
            icon: "auto_stories",
            text: "Temáticas",
            link: "adminTematics",
            code: ["07", "08"],
          },
          {
            icon: "bookmark_border",
            text: "Géneros",
            link: "adminGenders",
            code: ["09", "10"],
          },
          {
            icon: "folder_shared",
            text: "Usuarios",
            link: "adminUsuariosObra",
            code: ["37", "38"],
          },
          {
            icon: "workspaces",
            text: "Grupos",
            link: "adminGroups",
            code: ["11", "12"],
          },
          {
            icon: "picture_as_pdf",
            text: "Tipos de Trabajo",
            link: "adminTypeWorks",
            code: ["13", "14"],
          },
          {
            icon: "class",
            text: "Clasificaciones",
            link: "adminClasifications",
            code: ["15", "16"],
          },
          {
            icon: "label",
            text: "Clasificadores",
            link: "adminClasificators",
            code: ["17", "18"],
          },
          {
            icon: "language",
            text: "Idiomas",
            link: "adminLanguages",
            code: ["19", "20"],
          },
          {
            icon: "person_pin",
            text: "Público Objetivo Audiolibros",
            link: "adminPublicosA",
            code: ["39", "40"],
          },
          {
            icon: "person_pin",
            text: "Público Objetivo Ebooks",
            link: "adminPublicosE",
            code: ["41", "42"],
          },
          {
            icon: "menu_book",
            text: "Tipos de Libros",
            link: "adminTypeBooks",
            code: ["21", "22"],
          },
          {
            icon: "note",
            text: "Papeles",
            link: "adminPapers",
            code: ["23", "24"],
          },
          {
            icon: "tab",
            text: "Cartulinas",
            link: "adminCardBoards",
            code: ["25", "26"],
          },
          {
            icon: "storefront",
            text: "Sitios de Venta",
            link: "adminSellPlaces",
            code: ["27", "28"],
          },
        ],
      },
      {
        icon: "brush",
        text: "Diseño Vista Cliente",
        caption: "Gestión de interfaz",
        code: ["29", "30", "31", "32"],
        childrens: [
          {
            icon: "article",
            text: "Sección inicial",
            link: "adminHeaderInterface",
            code: ["29", "30"],
          },
          {
            icon: "style",
            text: "Sección carrusel",
            link: "adminCarouselInterface",
            code: ["31", "32"],
          },
        ],
      },
      {
        icon: "security",
        text: "Seguridad",
        caption: "Gestión de usuarios y roles",
        code: ["33", "34", "35", "36"],
        childrens: [
          {
            icon: "groups",
            text: "Usuarios",
            link: "adminUsers",
            code: ["33", "34"],
          },
          {
            icon: "admin_panel_settings",
            text: "Roles",
            link: "adminRoles",
            code: ["35", "36"],
          },
        ],
      },
    ]);

    onBeforeMount(() => {
      getUsuario();
      store.permissions = user.value.user.rol.permissions;
    });

    function getUsuario() {
      user.value = SessionStorage.getItem("User");
    }

    function logout() {
      SessionStorage.set("User", null);
      router.push({
        name: "login",
      });
    }
    function checkPermission(codeToCheck) {
      let permission = false;
      for (let i = 0; i < codeToCheck.length; i++) {
        permission =
          store.getPermissions.find((item) => item.code === codeToCheck[i]) !==
          undefined
            ? true
            : false;
        if (permission) {
          break;
        }
      }
      return permission;
    }
    return {
      checkPermission,
      miniDrawer,
      thumbStyle: {
        borderRadius: "100px 0px 0px 100px",
        width: "5px",
        backgroundColor: "#d2d2d2",
        opacity: "1",
      },

      menu_options,
      user,
      logout,
      leftDrawerOpen,
      toggleLeftDrawerMini() {
        miniDrawer.value = !miniDrawer.value;
      },
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
<style scoped>
.q-item__label--caption {
  color: #33435e !important;
}
</style>
