<template>
  <router-view />
</template>

<script>
import { defineComponent, onBeforeMount, onMounted } from "vue";
import { useQuasar, QSpinnerTail } from "quasar";

export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar();
    let timer;

    onBeforeMount(async () => {
      $q.loading.show({
        spinner: QSpinnerTail,
      });
    });
    onMounted(async () => {
      document.onreadystatechange = () => {
        if (document.readyState == "complete") {
          $q.loading.hide();
        }
      };
    });

    return {};
  },
});
</script>
<style></style>
