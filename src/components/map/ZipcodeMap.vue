<template>
  <GoogleMap
    :api-key="Google_Maps_Api_key"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="12"
  >
    <!-- <Polygon
      :options="{
        path: this.paths,
        fillColor: 'red',
        strokeColor: 'red',
        fillOpacity: 0.5,
        strokeWeight: 2,
      }"
    ></Polygon> -->
    <Circle
      v-for="path in paths"
      :options="{
        center: path,
        radius: 2000,
        strokeColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      }"
    />
  </GoogleMap>
</template>

<script>
import { defineComponent } from "vue";
import { GoogleMap, Polygon, Circle } from "vue3-google-map";
import axios from "axios";

export default defineComponent({
  components: { GoogleMap, Polygon, Circle },
  props: {
    zipcodes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      center: {},
      paths: [],
      Google_Maps_Api_key: process.env.GOOGLE_MAPS_API_KEY,
    };
  },

  mounted() {
    this.initPath();
  },
  methods: {
    async initPath() {
      const paths = await this.$api.googleMap.GetGeocoder(this.zipcodes);
      this.paths = paths;
      this.center = paths[0];
    },
  },
});
</script>
