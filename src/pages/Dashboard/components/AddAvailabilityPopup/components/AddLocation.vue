<template>
  <q-card flat class="br-10 card">
    <q-card-section class="q-pa-none q-mb-md">
      <div class="text-center">
        <div class="heading-two text-grey-8">Create Area</div>
        <div class="text-center body-text-caption q-mx-xl">
          Name your area to quickly add multiple locations when building your
          schedule
        </div>
        <q-input
          filled
          v-model="areaName"
          label="Name this area"
          dense
          class="q-mx-md"
          error-message="Field is required"
        />
        <CreateArea @add-location="AddLocation" :plan="plan" />
        <ZipcodeDisplay
          class="q-mt-md q-mx-md"
          @input="locations = [...$event]"
          @upgrade="$emit('upgrade')"
          :value="locations"
          :plan="plan"
          v-if="locations.length > 0"
        />
        <div class="q-pt-xl">
          <q-btn
            class="secondary-button q-mt-md q-mr-md"
            no-caps
            flat
            label="Cancel"
            @click="$emit('cancel')"
          />
          <q-btn
            class="primary-button q-mt-md"
            no-caps
            flat
            label="Create Area"
            @click="CreateArea()"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { auth } from "src/boot/firebase";
import CreateArea from "./CreateArea.vue";
import ZipcodeDisplay from "./ZipcodeDisplay.vue";

export default {
  name: "AddLocation",
  components: {
    CreateArea,
    ZipcodeDisplay,
  },
  props: {
    plan: {
      type: String,
    },
    item: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedZipCodes: [],
      zipCodeOptions: [],
      locations: [],
      areaName: "",
      existingArea: false,
    };
  },

  mounted() {
    if (this.item?.id) {
      this.existingArea = true;
      this.areaName = this.item.name;
      this.locations = [...this.item.locations];
    }
  },

  methods: {
    AddLocation(locations) {
      if (typeof locations[0] != "string") {
        const zipCodes = locations.map((location) => location.zip_code);
        this.locations = [...this.locations, ...zipCodes];
      } else {
        this.locations = [...this.locations, ...locations];
      }

      //remove duplicates
      this.locations = [...new Set(this.locations)];
    },
    async CreateArea() {
      const locations = this.locations;
      const name = this.areaName;
      const uid = auth.currentUser.uid;

      if (name == "") {
        return this.$q.notify({
          message: "Please enter a name for this area",
          color: "negative",
          position: "top",
        });
      }
      //validate that locations is an array of strings that are 5 digits
      const zipCodeRegex = /^\d{5}$/;
      const validZipCodes = locations.every(
        (zip) =>
          zip.trim().length === 5 &&
          !isNaN(zip) &&
          zipCodeRegex.test(zip.trim())
      );

      if (!validZipCodes) {
        this.$q.notify({
          message:
            "Please enter valid zip codes. This should be a comma separated list of 5 digit zip codes",
          color: "negative",
          position: "top",
        });
        return;
      }

      const { success, message } = await this.$api.areas.CreateArea(
        name,
        locations,
        uid,
        this.item.id
      );

      this.$emit("cancel");

      return this.$q.notify({
        message,
        color: success ? "positive" : "negative",
        position: "top",
      });
    },
  },
};
</script>
