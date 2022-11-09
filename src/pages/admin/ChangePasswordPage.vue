<template>
  <change-password-card />
</template>

<script>
import { defineComponent } from "vue";
import ChangePasswordCard from "../../components/admin/ChangePasswordCard";

export default defineComponent({
  name: "ChangePasswordPage",
  components: {
    ChangePasswordCard,
  },
});
</script>
