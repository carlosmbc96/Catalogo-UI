<template>
  <div class="q-pa-xl row flex-center" style="background-color: white">
    <div style="width: 80vw">
      <div
        v-if="setCarruselList.length !== 1"
        class="title-carousel col-12 items-center q-mb-sm"
        style="width: auto"
        :style="$q.screen.lt.sm ? 'font-size: 14px' : ''"
      >
        {{ title_carrusel }}
      </div>
      <q-carousel
        v-model="popular_search_selected"
        swipeable
        animated
        height="100%"
        infinite
        arrows
        class="carousel col-12 q-mb-md"
        transition-prev="slide-right"
        transition-next="slide-left"
        style="width: auto"
      >
        <q-carousel-slide
          v-for="(element, index) in setCarruselList"
          :key="element.id"
          :name="element.id"
          class="row flex-center"
          style="padding: 3%; height: 344px !important"
          :style="
            $q.screen.lt.sm
              ? 'padding: 6% !important; height: 30em !important'
              : ''
          "
        >
          <div class="col" :class="$q.screen.lt.sm ? 'col-12' : 'col'">
            <div
              class="row col-12 scroll-most-popular-search flex-center"
              style="height: 220px; overflow-x: hidden; overflow-y: auto"
              :style="
                $q.screen.lt.sm
                  ? 'height: auto !important; margin-bottom: 20px'
                  : ''
              "
            >
              <div class="author col-12">
                {{ setCarruselList[setCarruselList.length - 1][index] }}
              </div>
              <div class="title col-12">
                {{ element.titulo }}
              </div>
              <q-btn
                v-if="!$q.screen.lt.sm"
                class="col-12"
                outline
                @click="showDetails(element)"
                style="color: white; border-radius: 10px; width: 50%"
                label="Detalles"
              />
            </div>
          </div>
          <div
            v-if="!$q.screen.lt.md"
            class="col flex-center summary scroll-most-popular-search"
            style="
              overflow-x: hidden;
              overflow-y: hidden;
              text-align: center;
              height: 271px;
              display: flex;
              align-content: center;
              display: -webkit-box;
              -webkit-line-clamp: 15;
              -webkit-box-orient: vertical;
            "
          >
            {{ element.peq_resenha_obra }}
          </div>
          <div
            class="col"
            style="display: flex; justify-content: center"
            :class="$q.screen.lt.sm ? 'col-12' : 'col'"
            :style="$q.screen.lt.sm ? ' margin-bottom: 20px' : ''"
          >
            <div
              v-if="element.portada !== null"
              :style="[url(index)]"
              style="
                box-shadow: 0 0 5px -1px black,
                  inset -1px 1px 2px rgba(255, 255, 255, 0.5);
                margin: auto;
                border-radius: 5px;
                width: 50%;
                height: 230.44px;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center;
              "
              :class="$q.screen.lt.sm ? 'img-carrusel-movile' : ''"
            ></div>
            <div
              v-else
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 230.44px;
              "
              :class="$q.screen.lt.sm ? 'img-carrusel-movile' : ''"
            >
              <q-icon
                name="image_not_supported"
                size="120px"
                style="color: white"
              />
            </div>
          </div>
          <q-btn
            class="col-12"
            v-if="$q.screen.lt.sm"
            outline
            @click="showDetails(element)"
            style="
              color: white;
              border-radius: 10px;
              width: 50%;
              margin-top: 10px;
            "
            label="Detalles"
          />
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
  <details-modal
    :show="show_details"
    @close="show_details.show = false"
  ></details-modal>
</template>

<script>
import { ref, toRef, computed, onBeforeMount, watch } from "vue";
import { useQuasar } from "quasar";
import DetailsModal from "./DetailsModal.vue";
export default {
  name: "MorePopularSearch",
  components: {
    DetailsModal,
  },
  props: ["title", "search_list"],
  setup(props) {
    const $q = useQuasar();
    const show_details = ref({
      show: false,
      object: {},
    });
    const carrusel_list = toRef(props, "search_list");
    const title_carrusel = toRef(props, "title");
    const autoplay = ref(true);
    const popular_search_selected = ref(null);
    $q.screen.setSizes({ sm: 400 });

    watch(carrusel_list, () => {
      popular_search_selected.value = carrusel_list.value[0].id;
    });

    const setCarruselList = computed(() => {
      return carrusel_list.value;
    });

    function url(index) {
      return `background: linear-gradient( to right, rgb(255, 255, 255) 3px, rgba(255, 255, 255, 0.5) 5px, rgba(255, 255, 255, 0.25) 7px, rgba(255, 255, 255, 0.25) 10px, transparent 12px, transparent 16px, rgba(255, 255, 255, 0.25) 17px, transparent 22px), url( ${process.env.API}/storage/${carrusel_list.value[index].portada});`;
    }
    function showDetails(obj) {
      let names = "";
      obj.autores.forEach((autor) => {
        names += autor.nombre + ", ";
      });
      show_details.value.show = true;
      show_details.value.authors_names = names.substring(0, names.length - 2);
      show_details.value.object = obj;
    }
    return {
      autoplay,
      setCarruselList,
      showDetails,
      show_details,
      popular_search_selected,
      carrusel_list,
      url,
      title_carrusel,
    };
  },
};
</script>

<style scoped>
@media screen and (max-width: 800px) {
}
.carousel {
  background-image: linear-gradient(to bottom, #2277aa, #33435e);
  border-radius: 10px;
}
.img-carrusel-movile {
  width: 75% !important;
  height: 35vh !important;
}
.author {
  font-size: 12px;
  color: #fff;
  text-align: center;
}
.title {
  font-size: 1em;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
.summary {
  color: #fff;
  font-size: 12px;
}
.title-carousel {
  font-size: 18px;
  color: #5b5b5b;
}
</style>
