<template>
  <login-card></login-card>
</template>

<script>
import { defineComponent } from "vue";
import LoginCard from "../../components/admin/LoginCard.vue";

export default defineComponent({
  name: "ErrorNotFound",
  components: {
    LoginCard,
  },
});
</script>
