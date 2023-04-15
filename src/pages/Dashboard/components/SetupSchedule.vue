<template>
  <q-card flat bordered class="br-10 q-pa-md">
    <q-card-section v-if="!showSetupForm">
      <div class="text-center">
        <div class="heading-two">Start optimizing your routes</div>
        <div>
          Easily setup a virtual scheduler that restricts availablity based on
          your location
        </div>
        <q-btn
          class="primary-button q-mt-md"
          no-caps
          flat
          label="Setup Schedule"
          @click="showSetupForm = true"
        />
      </div>
    </q-card-section>
    <q-card-section v-else>
      <div dclass="text-center">
        <div class="row justify-between q-mb-md">
          <div>
            <q-btn
              class="secondary-button"
              label="back"
              icon="las la-chevron-circle-left"
              no-caps
              flat
              @click="closeSchedulePage"
            />
          </div>

          <div>
            <q-btn
              class="primary-button"
              label="Save"
              no-caps
              flat
              type="submit"
              @click="submitSchedule"
            />
          </div>
        </div>
      </div>
      <div class="heading-one text-grey-8">Setup Your Schedule</div>
      <div class="body-text-small text-grey-8">
        Setup your schedule to organize your availability by location so you can
        start scheduling more appointments per day and drive less
      </div>
      <!--<div
        class="text-info text-underline clickable"
        @click="$emit('upgrade')"
        v-if="user?.subscription?.type != 'premium'"
      >
        Turn on <span>SmartScheduling</span>
      </div>-->
      <q-form @submit.prevent>
        <div class="q-mt-md q-gutter-y-md">
          <div v-for="(day, index) in dayOptions" :key="day">
            <div class="q-mt-sm" v-if="getDisability(index)">
              <div class="body-text-bold">{{ day }}:</div>
              <q-list
                bordered
                class="br-10"
                v-for="availability in getAvailability(day)"
                :key="availability.uuid"
              >
                <div class="q-px-md calendar-list-item">
                  <div class="br-10">
                    <q-item bordered class="row">
                      <q-item-section class="col-4">
                        <div>
                          {{ availability.startTime }} to
                          {{ availability.endTime }}
                        </div>
                      </q-item-section>
                      <q-item-section class="col-4">
                        <div v-if="availability.zipcodes === 'all'">
                          No location required
                        </div>
                        <div v-else class="row">
                          {{ `Locations: ` }}
                          <div
                            v-for="item in availability.areas"
                            class="row q-pl-sm"
                          >
                            {{ item.name }}
                          </div>
                        </div>
                      </q-item-section>
                      <q-item-section side class="col-4">
                        <div class="row q-gutter-x-sm">
                          <div v-if="availability.smart">
                            <span class="duration-display">smart</span>
                          </div>
                          <div>
                            <span class="duration-display">{{
                              availability.meetingDuration.label
                            }}</span>
                          </div>
                          <div>
                            <q-btn
                              dense
                              size="sm"
                              icon="las la-pen"
                              flat
                              @click="editAvailability(availability.uuid)"
                              style="border-radius: 20px"
                            >
                              <q-tooltip
                                >Edit your availability</q-tooltip
                              ></q-btn
                            >
                          </div>
                          <div>
                            <q-btn
                              dense
                              size="sm"
                              icon="las la-trash"
                              flat
                              @click="deleteAvailability(availability.uuid)"
                              style="border-radius: 20px"
                            >
                              <q-tooltip
                                >Delete your availability</q-tooltip
                              ></q-btn
                            >
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-list>
              <div class="q-mt-sm">
                <div>
                  <q-btn
                    class="secondary-button mr-4"
                    no-caps
                    flat
                    label="Add Availability"
                    @click="setShowAvailabilityPopup(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-dialog v-model="showAvailabilityPopup">
      <AddAvailabilityPopup
        :day="activeDay"
        :availability="this.updateAvailability"
        @add-availability="addAvailability"
        @cancel="showAvailabilityPopup = false"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { ref } from "vue";
import CalendarAvailabilityListItem from "./CalendarAvailabilityListItem.vue";
import AddAvailabilityPopup from "./AddAvailabilityPopup/AddAvailabilityPopup.vue";

export default {
  name: "SetupSchedule",
  components: {
    CalendarAvailabilityListItem,
    AddAvailabilityPopup,
  },
  props: {
    schedule: {
      type: Object,
      default: () => ({}),
    },
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      updateAvailability: {},
      newSchedule: { ...this.schedule },
      selectedDate: "2023/03/01",
      showSetupForm: true,
      showAvailabilityPopup: false,
      activeDay: 0,
      dayOptions: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    };
  },
  setup() {
    return {
      selectedDate: ref("2023/03/15"),
    };
  },
  mounted() {
    this.newSchedule = { ...this.schedule };
  },
  methods: {
    getDisability(day) {
      // let today = new Date().getDay();
      // if (today === 0) today = 6;
      // else today -= 1;
      // return today <= day;
      return true;
    },
    closeSchedulePage() {
      this.$emit("close");
    },
    deleteAvailability(uuid) {
      this.newSchedule.availability = [
        ...this.newSchedule.availability.filter((av) => av.uuid !== uuid),
      ];
    },
    editAvailability(uuid) {
      this.showAvailabilityPopup = true;
      this.updateAvailability = this.newSchedule.availability.filter(
        (av) => av.uuid === uuid
      )[0];
    },
    async addAvailability(availability) {
      const {
        startTime,
        endTime,
        zipcodes,
        date,
        areas,
        meetingDuration,
        timezone,
        smart,
      } = availability;
      this.showAvailabilityPopup = false;
      if (!this.newSchedule.availability) this.newSchedule.availability = [];
      try {
        if (
          this.newSchedule?.availability.some(
            (av) => av.uuid === this.updateAvailability.uuid
          )
        ) {
          this.newSchedule.availability = [
            ...this.newSchedule.availability.filter(
              (av) => av.uuid !== this.updateAvailability.uuid
            ),
            {
              ...this.updateAvailability,
              startTime,
              endTime,
              zipcodes,
              date,
              areas,
              meetingDuration,
              timezone,
              smart,
            },
          ];
        } else {
          this.newSchedule?.availability.push({
            day: this.dayOptions[this.activeDay],
            startTime,
            endTime,
            zipcodes,
            date,
            areas,
            meetingDuration,
            timezone,
            smart,
            uuid: this.$api.utils.createUuid(),
          });
        }
        //update backend
        // await this.$api.scheduling.UpdateSchedule(this.schedule);
      } catch (e) {
        console.log(e);
      }
      this.updateAvailability = {};
    },
    hasAvailability(day) {
      return (
        this.newSchedule?.availability?.findIndex((item) => item.day === day) >
        -1
      );
    },
    getAvailability(day) {
      return this.newSchedule?.availability?.filter((item) => item.day === day);
    },
    setShowAvailabilityPopup(day) {
      this.activeDay = day;
      this.showAvailabilityPopup = true;
    },
    submitSchedule() {
      this.$emit("submit-schedule", this.newSchedule);
    },
  },
};
</script>

<style scoped>
.duration-display {
  color: #006bff;
  background: #006bff20;
  padding: 5px;
  border-radius: 10px;
}

/*.calendar-list-item:hover {
  transform: translateY(-2px) scale(1.02);
}*/
</style>
