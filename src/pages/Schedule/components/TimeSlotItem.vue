<template>
  <q-btn
    :class="selectedSlot === slot ? 'slot-time-selected' : 'slot-time'"
    transition
    outline
    color="primary"
    :label="slot"
    @click="this.$emit('selectSlot')"
  />
  <q-btn
    v-if="selectedSlot === slot"
    unelevated
    color="primary"
    class="slot-confirm"
    no-caps
    label="Confirm"
    transition-show="slide-right"
    transition-hide="slide-left"
    @click="this.$emit('confirmSlot')"
  />
</template>
<script>
export default {
  name: "TimeSlotItem",
  props: {
    slot: {
      type: String,
      required: true,
    },
    selectedSlot: {
      type: String,
      required: true,
    },
  },
  mounted() {
    console.log(this.selectedSlot);
  },
};
</script>
<style scoped>
.slot-time {
  max-width: 200px;
  width: 100%;
}
.slot-time-selected {
  max-width: 95px;
  width: 100%;
}
.slot-confirm {
  max-width: 95px;
  width: 100%;
}
</style>
