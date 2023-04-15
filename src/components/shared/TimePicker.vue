<template>
  <div class="row time-picker">
    <q-select v-model="hour" :options="hours" filled dense />
    <div class="text-center" style="font-size: 28px">:</div>
    <q-select v-model="minute" :options="minutes" filled dense />
    <q-select v-model="ampm" :options="amPm" filled dense class="q-ml-md" />

    <input type="hidden" :value="formattedTime" />
  </div>
</template>

<script>
export default {
  name: "CustomTimePicker",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hour: "9",
      minute: "00",
      ampm: "AM",
      hours: Array.from({ length: 12 }, (_, i) => i + 1),
      minutes: Array.from({ length: 4 }, (_, i) => {
        return (i * 15).toString().padStart(2, "0");
      }),
      amPm: ["AM", "PM"],
    };
  },
  mounted() {
    if (this.value) this.parseValue();
  },
  methods: {
    parseValue() {
      if (
        !this.value ||
        !this.value.includes(":") ||
        !this.value.includes(" ")
      ) {
        // If value is empty or not in the expected format, set default values
        this.hour = "";
        this.minute = "";
        this.ampm = "";
        return;
      }

      const [time, period] = this.value.split(" ");
      let [hour, minute] = time.split(":");
      if (period === "PM" && period < 12) {
        hour = parseInt(hour, 10) + 12;
      }
      this.hour = parseInt(hour, 10).toString();
      this.minute = parseInt(minute, 10).toString().padStart(2, "0");
      this.ampm = period;
    },
  },
  computed: {
    formattedTime() {
      let hour = parseInt(this.hour, 10);
      // if (this.ampm === "PM" && hour < 12) {
      //   hour += 12;
      // }
      // if (this.ampm === "AM" && hour === 12) {
      //   hour = 0;
      // }
      const minute = this.minute;
      return `${hour}:${minute}`;
    },
  },
  watch: {
    hour() {
      this.$emit("input", this.formattedTime + " " + this.ampm);
    },
    minute() {
      this.$emit("input", this.formattedTime + " " + this.ampm);
    },
    ampm() {
      this.$emit("input", this.formattedTime + " " + this.ampm);
    },
  },
};
</script>
<style scoped>
.time-picker {
  min-width: 450px;
}
</style>
