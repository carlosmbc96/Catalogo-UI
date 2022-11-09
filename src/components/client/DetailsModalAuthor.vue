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
      :style="$q.screen.lt.md ? 'align-content: flex-start' : ''"
    >
      <div
        class="col-4"
        :class="
          $q.screen.lt.sm || $q.screen.lt.md
            ? 'details-author-movil-perfil'
            : ''
        "
      >
        <q-img
          v-if="show_details.object.perfil"
          no-spinner
          :src="getPerfilImage(show_details.object)"
          width="100%"
          height="100%"
          fit="fill"
        />
        <span v-else class="profile-author row justify-center items-center">
          <div
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-author-movil-initials'
                : ''
            "
            class="initials row justify-center items-center"
          >
            <span
              :class="
                $q.screen.lt.sm || $q.screen.lt.md
                  ? 'details-author-movil-initials-letters'
                  : ''
              "
              class="initials-letter"
              >{{ extractInitials(show_details.object.nombre) }}</span
            >
          </div>
        </span>
      </div>
      <div
        class="col-8 row q-pl-xl"
        :class="
          $q.screen.lt.sm || $q.screen.lt.md ? 'details-author-movil-info' : ''
        "
      >
        <span class="col-11 row">
          <span
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-author-movil-name'
                : ''
            "
            class="col-12 self-end"
            style="color: #5b5b5b; font-size: 30px; font-weight: 600"
            >{{ show_details.object.nombre }}</span
          >
        </span>
        <q-icon
          class="col-1 self-start q-mt-md"
          name="close"
          size="23px"
          @click="closeDetails"
          style="cursor: pointer"
          :class="
            $q.screen.lt.sm || $q.screen.lt.md ? 'absolute-top-right' : ''
          "
          :style="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'margin-top: 9%; margin-right: 9%; position: absolute; height: 1.2em; width: 1.2em; border-radius: 100%; background: #ffffff52'
              : ''
          "
        />
        <span
          v-if="!$q.screen.lt.sm && !$q.screen.lt.md"
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-author-movil-biography'
              : ''
          "
          class="col-12 q-pr-xl"
          style="color: #5b5b5b; font-size: 16px"
        >
          {{ show_details.object.peq_biografia }}
        </span>

        <span
          v-else-if="!more"
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-author-movil-biography'
              : ''
          "
          class="col-12 q-pr-xl"
          style="color: #5b5b5b; font-size: 16px"
        >
          {{ resenha_less }}
        </span>
        <span
          v-if="more"
          class="col-12 q-pr-xl details-author-movil-biography"
          style="color: #5b5b5b"
        >
          {{ show_details.object.peq_biografia }}
        </span>
        <span
          v-if="
            ($q.screen.lt.sm || $q.screen.lt.md) &&
            show_details.object.peq_biografia !== null
          "
          class="read-more"
          @click="
            () => {
              more = !more;
            }
          "
          >{{ expand }}</span
        >
        <div
          class="row col-12 q-pr-xl list-l_w"
          :class="
            $q.screen.lt.sm || $q.screen.lt.md
              ? 'details-author-movil-obras-container'
              : ''
          "
          style="align-content: center"
        >
          <span
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-author-movil-obras'
                : ''
            "
            class="col-12"
            style="font-size: 18px; font-weight: 600; color: #5b5b5b"
            >Obras</span
          >
          <div
            class="row col-12 q-mb-sm"
            v-if="show_details.object.obras.length !== 0"
          >
            <div
              :class="
                $q.screen.lt.sm || $q.screen.lt.md
                  ? 'details-author-movil-obras-for'
                  : ''
              "
              v-for="(l_w, index) in show_details.object.obras"
              :key="index"
              style="border-radius: 5px; height: 70px"
              class="row col-12 q-mb-sm"
            >
              <div
                class="row items-center col-12"
                style="height: 70px"
                :class="
                  $q.screen.lt.sm || $q.screen.lt.md
                    ? 'details-author-movil-obras-for-1'
                    : ''
                "
              >
                <div v-if="!$q.screen.lt.sm && !$q.screen.lt.md" class="col-1">
                  <q-img
                    v-if="l_w.portada !== null"
                    no-spinner
                    height="70px"
                    width="60px"
                    fit="fill"
                    :src="getPortada(l_w)"
                    style="border-radius: 5px 0px 0px 5px"
                  />
                  <q-icon
                    v-else
                    name="image_not_supported"
                    size="40px"
                    style="color: rgba(91, 91, 91, 0.6)"
                  />
                </div>
                <div
                  class="col q-ml-md"
                  :class="
                    $q.screen.lt.sm || $q.screen.lt.md
                      ? 'details-author-movil-obras-for-title'
                      : ''
                  "
                >
                  <span style="color: #5b5b5b; font-size: 13px">{{
                    l_w.titulo
                  }}</span>
                </div>
                <div class="col-1 row justify-end">
                  <span
                    :class="
                      $q.screen.lt.sm || $q.screen.lt.md
                        ? 'details-author-movil-obras-for-format'
                        : ''
                    "
                    style="
                      background-color: rgba(24, 169, 226, 0.2);
                      padding: 0 10px;
                      border-radius: 5px;
                      color: #2375a9;
                    "
                    >{{ l_w.tipo_trabajo.nombre }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            v-else-if="!$q.screen.lt.sm"
            class="empty-results col-12 row flex-center"
          >
            <q-icon
              :style="$q.screen.lt.md ? 'font-size: 6em' : ''"
              name="clear_all"
              color="grey-13"
              size="200px"
            />No tiene obras publicadas en esta editorial...
          </div>
          <div
            :class="
              $q.screen.lt.sm || $q.screen.lt.md
                ? 'details-author-movil-obras-empty-results'
                : ''
            "
            v-else-if="$q.screen.lt.sm || $q.screen.lt.md"
            class="empty-results col-12 row flex-center"
          >
            <q-icon
              :class="
                $q.screen.lt.sm || $q.screen.lt.md
                  ? 'details-author-movil-obras-empty-results-icon'
                  : ''
              "
              name="clear_all"
              color="grey-13"
              size="200px"
            />
            <span style="font-size: 9px"
              >No tiene obras publicadas en esta editorial...</span
            >
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script>
import { toRef, ref, watch, onBeforeUpdate } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "DetailsModal",
  props: ["show"],
  setup(props, { emit }) {
    const show_details = toRef(props, "show");
    const $q = useQuasar();
    const expand = ref("Leer más...");
    const more = ref(false);
    const resenha_less = ref("");
    $q.screen.setSizes({ sm: 721, md: 1366 });

    onBeforeUpdate(() => {
      resenha_less.value = "";
      console.log(show_details.value.object.peq_biografia);
      if (show_details.value.object.peq_biografia !== null) {
        let arr = show_details.value.object.peq_biografia.split("");
        for (let i = 0; i < arr.length / 2; i++) {
          resenha_less.value += arr[i];
        }
      }
    });
    function extractInitials(name) {
      let first_initial = name.substring(0, 1);
      let second_initial = name.substring(
        name.indexOf(" ") + 1,
        name.indexOf(" ") + 2
      );
      return first_initial + second_initial;
    }
    watch(more, () => {
      expand.value = more.value ? "Leer menos..." : "Leer más...";
    });
    function getPerfilImage(param) {
      return `${process.env.API}/storage/${param.perfil}`;
    }
    function getPortada(param) {
      return `${process.env.API}/storage/${param.portada}`;
    }
    function closeDetails() {
      resenha_less.value = "";
      more.value = false;
      emit("close");
    }
    return {
      closeDetails,
      show_details,
      extractInitials,
      getPerfilImage,
      getPortada,
      expand,
      more,
      resenha_less,
    };
  },
};
</script>
<style scoped>
.profile-author {
  width: 100%;
  height: 100%;
  background-color: #2375a9;
}
.initials {
  width: 300px;
  height: 300px;
  border-radius: 100%;
  background-color: #fff;
}
.initials-letter {
  font-size: 100px;
  color: #2375a9;
  font-weight: 600;
}
.list-l_w {
  height: 300px;
  overflow: auto;
}
.empty-results {
  color: rgba(91, 91, 91, 0.6);
  font-size: 16px;
}
.details-author-movil-perfil {
  height: 70%;
  width: 100%;
}
.details-author-movil-initials {
  width: 13em;
  height: 13em;
}
.details-author-movil-initials-letters {
  font-size: 5em;
}
.details-author-movil-name {
  width: 100%;
  font-size: 1.3em !important;
}
.details-author-movil-biography {
  font-size: 0.8em !important;
  font-weight: 100;
  padding: 0px;
}
.details-author-movil-info {
  width: 100%;
  justify-content: start !important;
  text-align: start;
  padding: 5px 10px;
}
.details-author-movil-obras-empty-results {
  margin: 0px !important;
  display: block;
}
.details-author-movil-obras-empty-results-icon {
  font-size: 3em !important;
}
.details-author-movil-obras {
  height: 1.4em;
}
.details-author-movil-obras-container {
  height: auto;
  padding-right: 0px;
}
.details-author-movil-obras-for {
  height: auto !important;
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(91, 91, 91, 0.6);
  border-radius: 0px !important;
}
.details-author-movil-obras-for-1 {
  height: auto !important;
}
.details-author-movil-obras-for-title {
  margin: 0px !important;

  font-size: 0.8em !important;
}
.details-author-movil-obras-for-format {
  font-size: 0.7em !important;
}
.read-more {
  font-size: 0.8em;
  font-weight: 600;
  color: #2277aa;
}
</style>
