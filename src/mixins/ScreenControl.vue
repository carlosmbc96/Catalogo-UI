<script>
export default {
  computed: {
    isSmallScreen() {
      return this.$q.screen.lt.sm;
    },
    isMediumScreen() {
      return this.$q.screen.lt.md;
    },
    isLowResolution() {
      return this.$q.screen.lt.lg;
    },
  },
};
</script>
