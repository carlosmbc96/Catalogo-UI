<template>
  <q-dialog v-model="show_details.show">
    <div
      class="row"
      style="
        width: 85vw;
        max-width: 100vw;
        height: 94vh;
        background-color: white;
        border-radius: 10px;
      "
    >
      <div
        class="col-4"
        :class="$q.screen.lt.sm || $q.screen.lt.md ? 'details-movil-imgs' : ''"
      >
        <q-carousel
          v-if="
            show_details.object.portada !== null ||
            show_details.object.ilustracion1 !== null ||
            show_details.object.ilustracion2 !== null ||
            show_details.object.ilustracion3 !== null ||
            show_details.object.ilustracion4 !== null ||
            show_details.object.ilustracion5 !== null
          "
          style="height: 100%"
          animated
          v-model="slide"
          thumbnails
        >
          <q-carousel-slide
            v-if="show_details.object.portada !== null"
            :name="1"
            :img-src="url(show_details.object.portada)"
          />
          <q-carousel-slide
            v-if="show_details.object.ilustracion1 !== null"
            :name="2"
            :img-src="url(show_details.object.ilustracion1)"
          />
          <q-carousel-slide
            v-if="show_details.object.ilustracion2 !== null"
            :name="3"
            :img-src="url(show_details.object.ilustracion2)"
          />
          <q-carousel-slide
            v-if="show_details.object.ilustracion3 !== null"
            :name="4"
            :img-src="url(show_details.object.ilustracion3)"
          />
          <q-carousel-slide
            v-if="show_details.object.ilustracion4 !== null"
            :name="5"
            :img-src="url(show_details.object.ilustracion4)"
          />
          <q-carousel-slide
            v-if="show_details.object.ilustracion5 !== null"
            :name="6"
            :img-src="url(show_details.object.ilustracion5)"
          />
        </q-carousel>
        <div
          v-else
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
        >
          <q-icon
            name="image_not_supported"
            size="200px"
            style="color: rgba(91, 91, 91, 0.6)"
          />
        </div>
      </div>
      <div
        class="col-8 row q-pl-md"
        :class="$q.screen.lt.sm || $q.screen.lt.md ? 'details-movil-info' : ''"
      >
        <span
          class="col-11 row"
          :class="
            $q.screen.lt.sm || $q.screen.lt.md ? 'details-movil-info-title' : ''
          "
          style="font-size: 30px"
        >
          <span
            class="col-12 self-end"
            style="color: #5b5b5b; font-weight: 600"
            >{{ show_details.object.titulo }}</span
          >
        </span>
        <q-icon
          class="col-1 self-start q-mt-md"
          name="close"
          size="23px"
          @click="closeDetails"
          :class="
            $q.screen.lt.sm || $q.screen.lt.md ? 'absolute-top-right' : ''
          "
          style="cursor: pointer"
          :style="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'margin-top: 9%; margin-right: 9%; position: absolute; height: 1.2em; width: 1.2em; border-radius: 100%; background: #ffffff52'
              : ''
          "
        />
        <span
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-movil-info-authors'
              : ''
          "
          class="col-12"
          style="color: #5b5b5b; font-size: 16px"
          >{{ show_details.authors_names }}
        </span>
        <span
          v-if="!$q.screen.lt.sm && !$q.screen.lt.md"
          class="col-12 q-pr-xl"
          style="color: #5b5b5b; font-size: 16px; height: 280px; overflow: auto"
        >
          {{ show_details.object.peq_resenha_obra }}
        </span>

        <span
          v-else-if="!more"
          class="col-12 q-pr-xl details-movil-peq-resenha-obra"
          style="color: #5b5b5b"
        >
          {{ resenha_less }}
        </span>
        <span
          v-if="more"
          class="col-12 q-pr-xl details-movil-peq-resenha-obra"
          style="color: #5b5b5b"
        >
          {{ show_details.object.peq_resenha_obra }}
        </span>
        <span
          v-if="$q.screen.lt.sm || $q.screen.lt.md"
          class="read-more"
          @click="
            () => {
              more = !more;
            }
          "
          >{{ expand }}</span
        >

        <div
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-movil-info-sell-places'
              : ''
          "
          class="col-12 row"
          style="height: 90px"
        >
          <q-img
            v-if="!$q.screen.lt.sm"
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-movil-info-sell-places-icon'
                : ''
            "
            class="col-1"
            no-spinner
            fit="fill"
            width="70px"
            height="80px"
            src="~assets/Grupo-2682.webp"
          ></q-img>
          <span
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-movil-info-sell-places-title'
                : ''
            "
            class="col-7 q-ml-lg"
            style="color: #5b5b5b; font-size: 30px"
          >
            ¿Dónde adquirirlo?
            <span
              :class="
                $q.screen.lt.sm || $q.screen.lt.md
                  ? 'details-movil-info-sell-places-subtitle'
                  : ''
              "
              style="color: #5b5b5b; font-size: 16px; display: flex"
            >
              En estas plataformas y librerías podrá encontrar su obra
            </span>
          </span>
          <q-img
            v-if="$q.screen.lt.sm"
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-movil-info-sell-places-icon'
                : ''
            "
            class="col-1"
            no-spinner
            fit="fill"
            width="70px"
            height="80px"
            src="~assets/Grupo-2682.webp"
          ></q-img>
        </div>

        <div
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-movil-info-sell-places-container'
              : ''
          "
          v-if="sell_places_names.length !== 0"
          class="sell-places"
        >
          <div
            v-for="(sell_place, i) in sell_places_names_unrepeated"
            :key="sell_place"
            class="row col-12 q-mt-md"
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-movil-info-sell-places-container-1'
                : ''
            "
            style="
              padding-right: 50px;
              border-bottom: 1px solid rgba(91, 91, 91, 0.6);
            "
          >
            <span
              v-if="$q.screen.lt.sm || !$q.screen.lt.md"
              :class="
                $q.screen.lt.sm
                  ? 'details-movil-info-sell-places-container-1-title'
                  : ''
              "
              class="col-6"
              style="color: #2375a9; font-weight: 600"
            >
              {{ sell_place }}
              <span
                :class="
                  $q.screen.lt.sm || $q.screen.lt.md
                    ? 'details-movil-info-sell-places-container-1-subtitle'
                    : ''
                "
                style="display: flex; color: #5b5b5b; font-weight: 100"
                >{{ sell_places_direction_unrepeated[i] }}</span
              >
            </span>
            <span
              v-else-if="$q.screen.lt.md"
              :class="
                $q.screen.lt.sm
                  ? 'details-tablet-info-sell-places-container-1-title'
                  : ''
              "
              class="col-6"
              style="color: #2375a9; font-weight: 600"
            >
              {{ sell_place }}
              <span
                :class="
                  $q.screen.lt.sm || $q.screen.lt.md
                    ? 'details-movil-info-sell-places-container-1-subtitle'
                    : ''
                "
                style="display: flex; color: #5b5b5b; font-weight: 100"
                >{{ sell_places_direction_unrepeated[i] }}</span
              >
            </span>
            <span
              :class="
                $q.screen.lt.sm || $q.screen.lt.md
                  ? 'details-movil-info-sell-places-container-1-format'
                  : ''
              "
              v-for="(format_by_place, j) in formats_sell_places[i]"
              :key="j"
              class="col self-center text-center q-ml-xs"
              style="
                background-color: rgba(24, 169, 226, 0.2);
                padding: 0 10px;
                border-radius: 5px;
                color: #2375a9;
                max-width: 120px;
              "
              >{{ format_by_place }}
            </span>
          </div>
        </div>

        <div
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-movil-info-sell-places-container-1-format-empty-results'
              : ''
          "
          v-else-if="!$q.screen.lt.sm"
          class="empty-results col-12 row flex-center"
        >
          <q-icon
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-movil-info-sell-places-container-1-format-empty-results-icon'
                : ''
            "
            name="clear_all"
            color="grey-13"
            size="200px"
          />Actualmente, no se encuentra disponible...
        </div>
        <div
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-movil-info-sell-places-container-1-format-empty-results'
              : ''
          "
          v-else-if="$q.screen.lt.sm"
          class="empty-results col-12 row flex-center"
        >
          <q-icon
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-movil-info-sell-places-container-1-format-empty-results-icon'
                : ''
            "
            name="clear_all"
            color="grey-13"
            size="200px"
          />
          <span style="font-size: 9px"
            >Actualmente, no se encuentra disponible...</span
          >
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script>
import { toRef, ref, watch, onBeforeUpdate } from "vue";
import { useQuasar } from "quasar";

document.querySelectorAll(".-b-expander").forEach(function (el) {
  el.addEventListener("click", () => {
    el.classList.toggle("-b-text-undexpanded");
  });
});

export default {
  name: "DetailsModal",
  props: ["show"],
  setup(props, { emit }) {
    const show_details = toRef(props, "show");
    const slide = ref(null);
    const more = ref(false);
    const expand = ref("Leer más...");
    const sell_places_names_unrepeated = ref([]);
    const sell_places_names = ref([]);
    const sell_places_direction = ref([]);
    const sell_places_direction_unrepeated = ref([]);
    const formats_sell_places = ref([]);
    const $q = useQuasar();
    const resenha_less = ref("");
    const resenha_more = ref("");
    $q.screen.setSizes({ sm: 721, md: 1366 });

    onBeforeUpdate(() => {
      resenha_less.value = "";
      resenha_more.value = "";
      let arr = show_details.value.object.peq_resenha_obra.split("");
      for (let i = 0; i < arr.length / 2; i++) {
        resenha_less.value += arr[i];
      }
      if (show_details.value.object.portada !== null) {
        slide.value = 1;
      } else if (show_details.value.object.ilustracion1 !== null) {
        slide.value = 2;
      } else if (show_details.value.object.ilustracion2 !== null) {
        slide.value = 3;
      } else if (show_details.value.object.ilustracion3 !== null) {
        slide.value = 4;
      } else if (show_details.value.object.ilustracion4 !== null) {
        slide.value = 5;
      } else if (show_details.value.object.ilustracion5 !== null) {
        slide.value = 6;
      }
    });
    watch(more, () => {
      expand.value = more.value ? "Leer menos..." : "Leer más...";
    });
    watch(show_details.value, (currentValue, oldValue) => {
      sell_places_names.value = [];
      sell_places_names_unrepeated.value = [];
      sell_places_direction.value = [];
      sell_places_direction_unrepeated.value = [];
      formats_sell_places.value = [];
      currentValue.object.expediente.obras.forEach((obr) => {
        obr.ventas.forEach((sell) => {
          sell_places_names.value.push(sell.nombre);
          sell_places_direction.value.push(sell.direccion);
        });
      });
      sell_places_names_unrepeated.value = sell_places_names.value.filter(
        (ele, pos) => sell_places_names.value.indexOf(ele) == pos
      );
      sell_places_names_unrepeated.value.forEach((element) => {
        formats_sell_places.value.push([]);
      });
      sell_places_direction_unrepeated.value =
        sell_places_direction.value.filter(
          (ele, pos) => sell_places_direction.value.indexOf(ele) == pos
        );
      for (let j = 0; j < sell_places_names_unrepeated.value.length; j++) {
        for (let i = 0; i < currentValue.object.expediente.obras.length; i++) {
          currentValue.object.expediente.obras[i].ventas.forEach((sell) => {
            if (sell.nombre === sell_places_names_unrepeated.value[j]) {
              formats_sell_places.value[j].push(
                currentValue.object.expediente.obras[i].tipo_trabajo.nombre
              );
            }
          });
        }
      }
    });

    function url(url_ilust) {
      return `${process.env.API}/storage/${url_ilust}`;
    }
    function closeDetails() {
      resenha_less.value = "";
      more.value = false;
      emit("close");
    }
    return {
      show_details,
      closeDetails,
      expand,
      resenha_less,
      resenha_more,
      url,
      more,
      slide,
      sell_places_names,
      sell_places_names_unrepeated,
      sell_places_direction,
      sell_places_direction_unrepeated,
      formats_sell_places,
    };
  },
};
</script>
<style scoped>
.borde {
  border: 1px solid black;
}
.empty-results {
  color: rgba(91, 91, 91, 0.6);
  font-size: 16px;
  margin-top: -70px;
}
.sell-places {
  height: 200px;
  overflow: auto;
  width: 95%;
}
.details-movil-imgs {
  height: 70%;
  width: 100%;
}
.details-movil-info {
  width: 100%;
  justify-content: start !important;
  text-align: start;
  padding: 0px 10px;
}
.details-movil-info-title {
  width: 100%;
  font-size: 1.3em !important;
}
.details-movil-info-authors {
  width: 100%;
  font-size: 0.8em !important;
  font-weight: 600 !important;

  margin-bottom: 3px;
}
.details-movil-info-sell-places {
  height: 53px !important;
}
.details-movil-info-sell-places-title {
  font-size: 1em !important;
  font-weight: bold;
  width: 80%;
  margin-left: 0px !important;
}
.details-movil-info-sell-places-subtitle {
  font-size: 0.8em !important;
  font-weight: 100;
}
.details-movil-info-sell-places-icon {
  width: 3.1em !important;
  height: 3.5em !important;
}
.details-movil-info-sell-places-container {
  height: auto !important;
  overflow: hidden !important;
  width: 100% !important;
}
.details-movil-info-sell-places-container-1 {
  padding: 0px !important;
  justify-content: start !important;
  margin-top: 0.3em !important;
}
.details-movil-info-sell-places-container-1-title {
  font-size: 1em !important;
  width: 100% !important;
}
.details-tablet-info-sell-places-container-1-title {
  font-size: 1em !important;
  width: auto !important;
}
.details-movil-info-sell-places-container-1-subtitle {
  font-size: 0.8em !important;
}
.details-movil-info-sell-places-container-1-format {
  border-radius: 5px !important;
  margin-bottom: 3px !important;
  font-size: 0.7em;
}
.details-movil-info-sell-places-container-1-format-empty-results {
  margin-top: 25px !important;
  display: block;
}
.details-movil-info-sell-places-container-1-format-empty-results-icon {
  font-size: 3em !important;
}
.details-movil-peq-resenha-obra {
  font-size: 0.8em !important;
  padding-right: 0 !important;
}
.read-more {
  font-size: 0.8em;
  font-weight: 600;
  color: #2277aa;
}
</style>
