<template>
  <div>
    <q-card flat class="q-pa-xl text-center">
      <!-- Appointment submit result -->
      <div v-if="finished">
        <div class="heading-two">You're set!</div>
        <div>
          <div>Name: {{ this.name }}</div>
          <div>Email: {{ this.email }}</div>
          <div>Phone Number: {{ this.phoneNumber }}</div>
          <div>Address: {{ this.address }}</div>
          <div>Date: {{ this.selectedDate }}</div>
          <div>Start time: {{ this.selectedSlot }}</div>
          <div>Meeting Duration: {{ this.event.meetingDuration.label }}</div>
          <div>Notes: {{ this.description }}</div>
        </div>
        <div
          class="fixed-bottom q-mb-xl text-underline clickable"
          @click="goToMainPage()"
        >
          Create my own ProRouting Schedule
        </div>
      </div>
      <div v-else class="heading-two">Book an appointment</div>
    </q-card>
    <div v-if="!finished" class="row justify-center items-start">
      <!-- Left panel -->
      <div class="col-md-4 q-mb-md">
        <q-date
          v-if="!confirmedSlot"
          flat
          @update:model-value="handleCalendarChange"
          v-model="selectedDate"
          event-color="primary"
          color="white"
          text-color="grey"
          :events="datesWithEvents"
          :options="datesWithEvents"
          style="width: 100% !important"
          class="br-10"
          @navigation="evaluateDate"
        />
        <div v-else>
          <div>{{ new Date(this.selectedDate).toDateString() }}</div>
          <div>Start time: {{ selectedSlot }}</div>
          <div>Duration: {{ event.meetingDuration.label }}</div>
        </div>
      </div>

      <div class="event-list q-ml-md col-5 q-mt-md">
        <!-- Show availablilities for selected date -->
        <q-list
          bordered
          class="event br-10"
          v-if="!isSelectedEvent"
          v-for="event in matchingEvents"
          @click="setAvailability(event)"
          :key="event.uuid"
        >
          <CalendarAvailabilityListItem
            booking="true"
            :event="event"
            :date="selectedDate"
          />
        </q-list>
        <!-- Slot list -->
        <div v-else-if="!confirmedSlot" class="slots-container">
          <div v-if="loading" class="text-center q-mt-xl">
            <q-spinner-oval color="primary" size="4em" />
          </div>
          <div v-else-if="slots.length === 0">
            There is no available time slot
          </div>
          <div v-else class="text-center">
            <div class="q-mb-md">Choose from the available slots</div>
            <div v-for="slot in slots" :key="slot" class="slot">
              <TimeSlotItem
                :slot="slot"
                :selectedSlot="selectedSlot"
                @selectSlot="selectSlot(slot)"
                @confirmSlot="confirmSlot(slot)"
                @finished="finished = true"
              />
            </div>
          </div>
        </div>
        <!-- Details input form -->
        <div v-else>
          <CreateAppointment
            @back="confirmedSlot = ''"
            :zipcode="zipcode"
            :date="selectedDate"
            :startTime="this.selectedSlot"
            :duration="event.meetingDuration"
            :uid="uid"
            :id="id"
            :schedule="schedule"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarAvailabilityListItem from "../../Dashboard/components/CalendarAvailabilityListItem.vue";
import TimeSlotItem from "./TimeSlotItem.vue";
import CreateAppointment from "./CreateAppointment.vue";

export default {
  name: "CalendarAvailableScheduleDisplay",
  components: { CalendarAvailabilityListItem, TimeSlotItem, CreateAppointment },
  props: {
    availabilities: {
      type: Array,
      required: true,
    },
    zipcode: {
      type: String,
    },
    uid: {
      type: String,
    },
    id: {
      type: String,
    },
    schedule: {
      type: Object,
    },
    appointments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedDate: new Date(),
      datesWithEvents: [],
      isSelectedEvent: false,
      slots: [],
      selectedSlot: "",
      confirmedSlot: "",
      event: {},
      loading: false,
      finished: false,
      dateInfo: new Map(),
    };
  },
  async mounted() {
    const today = new Date();
    this.selectedDate = this.$api.utils.Dateyyyymmdd(today);
    this.days = this.availabilities.map((av) =>
      this.$api.utils.getDayIdx(av.day)
    );
    this.appointments.forEach((ap) => {
      let obj = this.dateInfo.get(ap.date);
      this.dateInfo.set(ap.date, {
        appointments: this.dateInfo.has(ap.date)
          ? [...obj.appointments, { ...ap }]
          : [{ ...ap }],
      });
    });
    await this.evaluateDate({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    });
  },
  methods: {
    goToMainPage() {
      window.open("https://prorouting.ai", "_BLANK");
    },
    async evaluateDate({ year, month }) {
      let date = new Date();
      if (year < date.getFullYear()) return [];
      if (year === date.getFullYear() && month - 1 < date.getMonth()) return [];
      let startDate = 1;
      if (year === date.getFullYear() && month - 1 === date.getMonth())
        startDate = date.getDate();
      const res = [];

      date.setFullYear(year);
      date.setMonth(month - 1);

      let lastDate = new Date();
      lastDate.setMonth(date.getMonth() + 1);
      lastDate.setDate(0);
      lastDate = lastDate.getDate();

      /* iterates available dates for the month and
        create Map object with date-avaiablilties pair for each date.
      */
      for (let i = startDate; i <= lastDate; i++) {
        //set date
        date.setDate(i);
        let flag = false;
        let styledDate = this.$api.utils.Dateyyyymmdd(date);
        // iterate all availabilities to operate
        for (let av of this.availabilities) {
          // check whether day is the same between availability's day and dat of the date.
          if (this.$api.utils.getDayIdx(av.day) !== date.getDay()) continue;
          // get not available time intervals for specific date
          let obj = this.dateInfo.get(styledDate);
          let period = parseInt(av.meetingDuration.value) / 15;
          const intervals =
            this.dateInfo.get(styledDate)?.appointments !== undefined
              ? obj.appointments.map((ap) => {
                  const start = this.$api.utils.timeToNumber(ap.startTime);
                  const end = start + period;
                  return { ...ap, start, end };
                })
              : [];

          // calculate available slots for specific availability
          let start = this.$api.utils.timeToNumber(av.startTime);
          let end = this.$api.utils.timeToNumber(av.endTime);
          let availableSlots = [];
          if (av.smart) {
            //smart scheduling
            availableSlots = await this.$api.smart.smartScheduling({
              appointments: intervals,
              newAppointmentZipcode: this.zipcode,
              maximumDistanceBetweenAppointments: 10, //set max distance to 10 miles
              workingTime: {
                from: start,
                to: end,
              },
              minimumBufferTime: 30,
              lengthOfAppointment: parseInt(av.meetingDuration.value, 10),
              date: styledDate,
            });
          } else {
            for (let i = start; i <= end - period; i++) {
              if (intervals.some((it) => i + period >= it.start && i < it.end))
                continue;
              availableSlots.push(this.$api.utils.numberToTime(i));
            }
          }
          // get availability with available time slots
          let avs = { ...av, slots: [...availableSlots] };
          // add availability with available time slots to dateInfo Map
          this.dateInfo.set(styledDate, {
            ...this.dateInfo.get(styledDate),
            availabilities:
              this.dateInfo.get(styledDate)?.availabilities === undefined
                ? [{ ...avs }]
                : [
                    ...this.dateInfo.get(styledDate)?.availabilities,
                    { ...avs },
                  ],
          });
          if (availableSlots.length > 0) flag = true;
        }
        if (flag) res.push(styledDate);
      }
      this.datesWithEvents = [...res];
    },
    selectSlot(slot) {
      if (this.selectedSlot === slot) this.selectedSlot = "";
      else this.selectedSlot = slot;
    },
    confirmSlot(slot) {
      this.confirmedSlot = slot;
    },
    openProrouting() {
      window.open("https://prorouting.ai", "_BLANK");
    },
    setAvailability(event) {
      this.loading = true;
      this.isSelectedEvent = true;
      this.event = {
        ...this.dateInfo
          .get(this.selectedDate)
          .availabilities.find((av) => event.uuid === av.uuid),
      };
      this.slots = [...this.event.slots];
      this.loading = false;
    },
    handleCalendarChange(date) {
      this.selectedDate = date;
      this.isSelectedEvent = false;
      this.selectedSlot = "";
      this.confirmedSlot = "";
    },
  },
  computed: {
    matchingEvents() {
      return this.dateInfo.get(this.selectedDate)?.availabilities !== undefined
        ? this.dateInfo
            .get(this.selectedDate)
            .availabilities.filter((av) => av.slots.length > 0)
        : [];
    },
  },
};
</script>
<style scoped>
.slot {
  display: flex;
  max-width: 200px;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 10px;
}
.slots-container {
  overflow: auto;
  max-height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background-color: darkgrey;
}

::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
