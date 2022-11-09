<template>
  <div class="row items-center justify-start fixed-top shadow-5 header-top">
    <div style="width: 20%; height: 60%; margin: 0px 1%">
      <div class="logo-top"></div>
    </div>

    <div class="row items-center search-banner" style="width: 74%">
      <general-search v-if="!is_visible" class="col"> </general-search>
      <q-btn
        v-if="!is_visible"
        style="
          width: 40px;
          margin-left: 3%;
          height: 45px;
          border-radius: 10px;
          background: #2277aa !important;
        "
        class="col-1"
        color="primary"
        icon="filter_alt"
        unelevated
        @click="store.leftDrawerOpen = !store.leftDrawerOpen"
      >
        <q-badge
          v-if="store.filter_list_toolbar_copy.length !== 0 && $q.screen.lt.sm"
          color="red"
          floating
          >{{ store.filter_list_toolbar_copy.length }}</q-badge
        >
        <q-badge
          v-else-if="store.filter_list_toolbar_copy_mobile.length !== 0"
          color="red"
          floating
          >{{ store.filter_list_toolbar_copy_mobile.length }}</q-badge
        >
      </q-btn>
    </div>
  </div>
</template>

<script>
import GeneralSearch from "./GeneralSearch.vue";
import { useQuasar } from "quasar";
import { ref, toRef } from "vue";
import { useCounterStore } from "../../stores/example-store";
export default {
  name: "BannerTop",
  components: { GeneralSearch },
  props: ["is_search_visible"],
  setup(props) {
    const is_visible = toRef(props, "is_search_visible");
    const store = useCounterStore();
    const $q = useQuasar();
    $q.screen.setSizes({ sm: 721 });

    return { is_visible, store };
  },
};
</script>

<style scoped>
.icon-filter {
  font-size: 30px;
  color: #2375a9;
  cursor: pointer;
}
.header-top {
  height: 60px;
  background-color: #ffffffe6 !important;
  z-index: 3000 !important;
  backdrop-filter: blur(5px);
}
.logo-top {
  background-image: url("~assets/LOGO_COLOR_3x.webp");
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
@media screen and (max-width: 800px) {
  .logo-top {
    background-image: url("~assets/logo.png");
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
