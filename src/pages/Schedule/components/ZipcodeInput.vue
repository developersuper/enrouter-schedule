<template>
  <div class="q-pb-lg">
    <div class="text-center q-pt-lg q-mt-xl">
      <span class="heading-two">What's your zipcode?</span>
    </div>
  </div>
  <div class="q-mx-md q-pb-lg">
    <div>
      <div class="text-center">
        <center>
          <q-input
            class="q-mb-md zipcode-input"
            filled
            dense
            color="primary"
            label="Enter your Zip Code"
            type="number"
            v-model="zipcode"
            :error="error"
            :error-message="errorMessage"
            @input="error = false"
          />
        </center>

        <q-btn
          class="primary-button q-mb-md"
          label="Find Appointments"
          flat
          no-caps
          @click="onZipcodeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Schedule",
  props: {
    availabilities: {
      type: Array,
    },
  },
  data() {
    return {
      zipcode: "",
      error: false,
      errorMessage: "",
    };
  },
  methods: {
    onZipcodeChange() {
      if (/^\d{5}(-\d{4})?$/.test(this.zipcode)) {
        if (
          this.availabilities.some(
            (av) => av.zipcodes === "all" || av.zipcodes.includes(this.zipcode)
          )
        ) {
          this.$emit("zipcode", this.zipcode);
          return;
        } else {
          console.log(this.availabilities);
          this.error = true;
          this.errorMessage = "We don't work in this area yet.";
        }
      } else {
        this.error = true;
        this.errorMessage = "Invalid zipcode";
      }
    },
  },
};
</script>
<style scoped>
.zipcode-input {
  width: 200px;
}
@media (max-width: 600px) {
  .zipcode-input {
    width: 100%;
  }
}
</style>
