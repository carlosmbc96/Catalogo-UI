<template>
  <div
    class="row q-pt-lg justify-center q-gutter-md"
    style="
      background-color: #eff3f6;
      min-height: 100vh;
      padding-left: 10px;
      padding-right: 10px;
    "
  >
    <div v-if="store.loading_filter_data" class="col-12 row flex-center">
      <q-spinner-dots size="4rem" color="grey-14" />
    </div>
    <div
      class="div-card"
      v-else
      v-for="(author, index) in store.authors_list"
      :key="index"
    >
      <div class="q-mb-xs card-author" @click="showDetails(author)">
        <div
          v-if="author.perfil === null"
          class="profile-author row justify-center items-center"
        >
          <div class="initials row justify-center items-center">
            <span class="initials-letter">{{
              extractInitials(author.nombre)
            }}</span>
          </div>
          <div class="row" style="margin-bottom: -80px">
            <span class="name-author col-12">{{ author.nombre }}</span>
            <span class="cant-literary-work col-12"
              >{{ author.obras.length }} Obras</span
            >
          </div>
        </div>

        <div v-else class="profile-author">
          <q-img
            style="border-radius: 10px"
            height="250px"
            no-spinner
            :src="getPerfilImage(author)"
          />
          <div class="row bottom-info">
            <span class="row gradient">
              <span class="name-author col-12">{{ author.nombre }}</span>
              <span class="cant-literary-work col-12"
                >{{ author.obras.length }} Obras</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 q-pb-sm row justify-center items-end">
      <q-btn
        dense
        outline
        :disable="
          store.current_page_authors === 1 || store.current_page_authors === 0
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
          store.current_page_authors === 1 || store.current_page_authors === 0
        "
        style="color: #2375a9"
        @click="getData('back')"
        icon="chevron_left"
      />
      <q-badge>
        {{ store.current_page_authors }}/{{ store.total_pages_authors }}
      </q-badge>

      <q-btn
        dense
        :disable="
          store.current_page_authors === store.total_pages_authors ||
          store.total_pages_authors === 0
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
          store.current_page_authors === store.total_pages_authors ||
          store.total_pages_authors === 0
        "
        flat
        round
        style="color: #2375a9"
        icon="last_page"
        @click="getData('last')"
      />
    </div>
  </div>

  <details-modal-author
    :show="show_details"
    @close="show_details.show = false"
  ></details-modal-author>
</template>

<script>
import { ref, onBeforeUpdate } from "vue";
import { useCounterStore } from "../../stores/example-store";
import { api, images } from "boot/axios";
import DetailsModalAuthor from "./DetailsModalAuthor.vue";

export default {
  name: "AuthorsTab",
  components: {
    DetailsModalAuthor,
  },
  setup() {
    const store = useCounterStore();
    const authors_books = ref([]);
    const show_details = ref({
      show: false,
      object: {},
    });

    onBeforeUpdate(() => {
      let nombre = "";
      authors_books.value = [];
      store.filtered_list_data.forEach((obra) => {
        obra.autores.forEach((autor) => {
          nombre += autor.nombre + ",";
        });
        const nom = nombre.substring(0, nombre.length - 1);
        nombre = "";
        authors_books.value.push(nom);
      });
    });

    function extractInitials(name) {
      let first_initial = name.substring(0, 1);
      let second_initial = name.substring(
        name.indexOf(" ") + 1,
        name.indexOf(" ") + 2
      );
      return first_initial + second_initial;
    }
    function showDetails(obj) {
      show_details.value.show = true;
      show_details.value.object = obj;
    }

    async function getData(page) {
      store.loading_filter_data = true;
      if (page === "next") {
        store.current_page_authors++;
      } else if (page === "back") {
        store.current_page_authors--;
      } else if (page === "first") {
        store.current_page_authors = 1;
      } else {
        store.current_page_authors = store.total_pages_authors;
      }
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
      } catch (error) {
        console.log(error);
      } finally {
        store.loading_filter_data = false;
        store.current_page_authors =
          store.total_pages_authors === 0 ? 0 : store.current_page_authors;
      }
    }
    function getPerfilImage(param) {
      return `${process.env.API}/storage/${param.perfil}`;
    }
    return {
      getPerfilImage,
      authors_books,
      getData,
      show_details,
      showDetails,
      store,
      extractInitials,
    };
  },
};
</script>

<style scoped>
.q-badge {
  background-color: #2375a9 !important;
  color: #fff;
  line-height: 27px;
}
.empty-results {
  color: rgba(91, 91, 91, 0.6);
  font-size: 20px;
}
.profile-author {
  border-radius: 10px;
  cursor: pointer;
  height: 250px;
  background-color: #2375a9;
}
.initials {
  margin-bottom: -100px;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: #fff;
}
.initials-letter {
  font-size: 50px;
  color: #2375a9;
  font-weight: 600;
}
.name-author {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cant-literary-work {
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.bottom-info {
  margin-top: -40px;
  position: absolute;
  max-width: 160px;
  width: 44%;
  min-width: 142px;
}
.gradient {
  border-radius: 0px 0px 10px 10px;
  width: 100%;
  max-width: 160px;
  min-width: 142px;
  height: 40px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0);
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000);
}
.card-author {
  width: 100%;
  height: auto;
  border-radius: 10px;
  min-width: 142px;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 5px 8px rgb(0 0 0 / 14%), 0 1px 14px rgb(0 0 0 / 12%);
  transition: all 0.4s ease;
}
.card-author:hover{
  transform: translateY(-3%);
  box-shadow: 0 6px 10px -2px rgb(0 0 0 / 20%), 0 10px 16px rgb(0 0 0 / 14%), 0 2px 28px rgb(0 0 0 / 12%);
}
.div-card {
  width: 44%;
  max-width: 160px;
}
</style>
