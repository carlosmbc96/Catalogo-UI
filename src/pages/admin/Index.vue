<template>
  <q-page class="row">
    <div class="col-10 absolute-center">
      <login-card />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import LoginCard from "../../components/admin/LoginCard.vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    LoginCard,
  },
});
</script>
