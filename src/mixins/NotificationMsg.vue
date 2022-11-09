<script>
export default {
  methods: {
    showNotif (message, icon, type) {
      this.$q.notify({
        message: message,
        icon: icon,
        type: type
      })
    }
  }
}
</script>

