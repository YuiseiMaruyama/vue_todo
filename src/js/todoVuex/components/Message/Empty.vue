<template lang="html">
  <p class="empty">{{ this.$store.state.emptyMessage }}</p>
</template>

<script>
export default {
  computed: {
    emptyMessage: function() {
      console.log(this.$store.state);
      return this.$store.state.emptyMessage;
    },
  },
};
</script>

<style lang="scss" scoped>
.empty {
  font-size: 14px;
  text-align: center;
}
</style>
