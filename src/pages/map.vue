<template>
  <zipcode-map :zipcodes="zipcodes"></zipcode-map>
</template>

<script>
import ZipcodeMap from "components/map/ZipcodeMap.vue";

export default {
  name: "Test",

  components: {
    ZipcodeMap,
  },

  data() {
    return {
      zipcodes: [
        90222, 90061, 90262, 90059, 90002, 90044, 90047, 90305, 90096, 90003,
        90052, 90201, 90001, 90255, 90270, 90082, 90037, 90058, 90062, 90011,
        90102, 90089, 90023, 90007, 90021, 90015, 90055, 90079, 90014, 90013,
      ],
    };
  },
};
</script>
