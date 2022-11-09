<template>
  <forgot-card />
</template>

<script>
import { defineComponent } from "vue";
import ForgotCard from "../../components/admin/ForgotCard";

export default defineComponent({
  name: "PageIndex",
  components: {
    ForgotCard,
  },
});
</script>
