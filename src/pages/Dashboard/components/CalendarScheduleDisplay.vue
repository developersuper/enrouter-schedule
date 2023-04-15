<template>
  <div class="row">
    <div class="col">
      <q-date
        flat
        @update:model-value="handleCalendarChange"
        v-model="selectedDate"
        event-color="primary"
        text-color="grey"
        color="white"
        class="br-10"
        :events="daysWithEvents"
        :options="daysWithEvents"
      />
    </div>

    <div class="col q-mt-md q-mr-md">
      <q-list
        bordered
        class="event br-10"
        v-for="event in matchingEvents"
        :key="event.id"
      >
        <CalendarListItem :event="event" @click="setItem(event)" />
      </q-list>
      <div v-if="matchingEvents.length === 0" class="q-mt-xl q-pt-xl q-ml-lg">
        No events scheduled for this day
      </div>
    </div>
  </div>
</template>

<script>
import CalendarListItem from "./CalendarListItem.vue";

export default {
  name: "CalendarScheduleDisplay",
  props: {
    schedule: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedDate: new Date(),
    };
  },
  mounted() {
    const today = new Date();
    this.selectedDate = this.$api.utils.Dateyyyymmdd(today);
  },
  computed: {
    // Returns an array of dates that have events for CalendarScheduleDisplay
    daysWithEvents() {
      const events =
        this.schedule?.map((event) =>
          this.$api.utils.Dateyyyymmdd(new Date(event.date))
        ) || [];
      return events;
    },
    //returns events that match the selected day
    matchingEvents() {
      return this.schedule?.filter(
        (event) =>
          this.$api.utils.Dateyyyymmdd(new Date(event.date)) ===
          this.selectedDate
      );
    },
  },

  methods: {
    handleCalendarChange(date) {
      this.selectedDate = date;
    },
    setItem(item) {
      this.$emit("select", item);
    },
  },
  components: { CalendarListItem },
};
</script>
