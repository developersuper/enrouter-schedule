<template>
  <q-card flat bordered class="br-10 popup-card q-pa-lg">
    <q-card-section
      v-if="!showAddLocation && !showManageAreas"
      class="q-pa-none"
    >
      <div class="text-center">
        <div class="heading-two text-grey-8">Add Availability</div>
        <q-form>
          <div flat>
            <div class="row text-left">
              <div class="col">
                <div>Start time:</div>
                <TimePicker
                  @input="startTime = $event"
                  label="Start Time"
                  :value="startTime"
                />
              </div>
              <div class="col">
                <label class="text-subtitle2">End time:</label>
                <TimePicker
                  @input="endTime = $event"
                  label="End Time"
                  :value="endTime"
                />
              </div>
            </div>

            <div class="col-12 q-mt-md">
              <q-select
                filled
                dense
                :options="timezones"
                v-model="timezone"
                label="Timezone"
              />
            </div>
          </div>
          <div class="row">
            <div v-if="!allAreas" class="q-mt-sm q-pt-sm">
              <q-checkbox
                v-model="smart"
                label="Set smart scheduling"
                @update:model-value="updateSmart"
                :disable="allAreas"
              />
              <q-tooltip class="q-px-md text-center" self="bottom middle">
                Set smart scheduling
              </q-tooltip>
            </div>
          </div>
          <div v-if="!smart" class="row">
            <div>
              <q-checkbox
                v-model="allAreas"
                label="Disable Location (online meeting, meet anywhere etc.)"
                @update:model-value="updateAllArea"
                :disable="smart"
              />
              <q-tooltip class="q-px-md text-center" self="bottom middle">
                Disabling location will remove the zipcode question from booking
                and assumes you are available to all areas
              </q-tooltip>
            </div>
          </div>

          <div class="row" v-if="!allAreas">
            <q-select
              v-model="areas"
              :options="areaOptions"
              label="Areas"
              color="primary"
              filled
              option-label="name"
              dense
              use-chips
              multiple
              class="q-mt-md col-6 q-pt-xs"
            />
            <div class="q-mt-md q-ml-md q-pt-sm">
              <q-btn
                label="Manage Areas"
                class="secondary-button"
                flat
                no-caps
                @click="manageArea"
              />
            </div>
          </div>

          <q-select
            v-model="meetingDuration"
            label="Meeting Duration"
            color="primary"
            :options="durationOptions"
            filled
            dense
            class="q-mt-md"
          />

          <q-btn
            class="secondary-button q-mt-md q-mr-md text-grey-8"
            no-caps
            flat
            label="Cancel"
            :disable="loading"
            @click="$emit('cancel')"
          />
          <q-btn
            class="primary-button q-mt-md"
            no-caps
            flat
            :loading="loading"
            :disable="loading"
            label="Save Availability"
            @click="saveAvailability"
          />
        </q-form>
      </div>
    </q-card-section>
    <q-card-section v-else-if="showManageAreas">
      <ManageAreas
        :areas="areaOptions"
        @edit="editArea"
        @delete="deleteArea"
        @back="showManageAreas = false"
        @create-area="editArea({})"
      />
    </q-card-section>
    <q-card-section v-else>
      <AddLocation :item="areaToEdit" @cancel="manageAreaAction" :plan="plan" />
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";
import { auth } from "src/boot/firebase";
import { TIMEZONES } from "src/config/config";

import TimePicker from "../../../../components/shared/TimePicker.vue";
import AddLocation from "./components/AddLocation.vue";
import ManageAreas from "./components/ManageAreas.vue";

export default {
  name: "AddAvailabilityPopup",
  components: {
    TimePicker,
    AddLocation,
    ManageAreas,
  },
  props: {
    day: {
      type: String,
      required: true,
    },
    availability: {
      type: Object,
    },
  },

  async mounted() {
    if (this.availability.uuid) {
      this.selectedDate = this.availability.date;
      this.startTime = this.availability.startTime;
      this.endTime = this.availability.endTime;
      this.timezone = this.availability.timezone;
      this.allAreas = this.availability.zipcodes === "all" ? true : false;
      this.areas = this.availability.areas;
      this.meetingDuration = this.availability.meetingDuration;
    }

    const uid = auth.currentUser.uid;
    const { user } = await this.$api.auth.GetUser(uid);
    if (user.subscription?.subscription === undefined) {
      this.plan = "free";
      return;
    }
    const subscription = await this.$api.billing.GetSubscription(
      user.subscription?.subscription?.subscription
    );
    let data = {
      subscription: subscription.id,
    };

    const { plan } = await this.$api.billing.ReturnUsersSubscription(data);
    this.plan = plan;
  },
  data() {
    return {
      smart: this.availability.smart ? this.availability.smart : false,
      showAddLocation: false,
      selectedDate: this.availability.uuid
        ? this.availability.date
        : "2023/03/01",
      startTime: this.availability.uuid
        ? this.availability.startTime
        : "09:00 AM",
      endTime: this.availability.uuid ? this.availability.endTime : "10:00 AM",
      timezone: this.availability.uuid ? this.availability.timezone : "",
      allAreas:
        this.availability.uuid && this.availability.zipcodes === "all"
          ? true
          : false,
      areas: this.availability.uuid ? this.availability.areas : [],
      loading: false,
      areaOptions: [],
      meetingDuration: this.availability.uuid
        ? this.availability.meetingDuration
        : { label: "0 minutes", value: 0 },
      durationOptions: [
        { label: "15 minutes", value: 15 },
        { label: "30 minutes", value: 30 },
        { label: "45 minutes", value: 45 },
        { label: "1 hour", value: 60 },
        { label: "75 minutes", value: 75 },
        { label: "90 minutes", value: 90 },
        { label: "105 minutes", value: 105 },
        { label: "2 hours", value: 120 },
        { label: "135 minutes", value: 135 },
        { label: "150 minutes", value: 150 },
        { label: "165 minutes", value: 165 },
        { label: "3 hours", value: 180 },
      ],
      showManageAreas: false,
      areaToEdit: {},
    };
  },
  created() {
    this.GetAreas();
  },
  computed: {
    timezones() {
      return TIMEZONES;
    },
    checkFormIsReady() {
      return (
        this.startTime &&
        this.endTime &&
        this.timezone &&
        this.areas &&
        this.meetingDuration
      );
    },
  },
  methods: {
    updateAllArea(value) {
      if (value) this.smart = false;
    },
    updateSmart(value) {
      if (value) this.allAreas = false;
    },
    manageArea() {
      if (
        (this.plan === "free" && this.areaOptions.length >= 2) ||
        (this.plan === "lite" && this.areaOptions.length >= 10)
      ) {
        this.$q.notify({
          message:
            "You have reached the maximum number of locations, please upgrade to add more",
          color: "negative",
          position: "top",
        });
        return;
      } else {
        if (this.areaOptions.length === 0) {
          this.showAddLocation = true;
        } else {
          this.showManageAreas = true;
        }
      }
    },
    saveAvailability() {
      try {
        this.loading = true;

        const checkForm = this.checkFormIsReady;
        if (!checkForm) {
          this.$q.notify({
            message: "Please fill out all required fields",
            color: "negative",
            position: "top",
            timeout: 2000,
          });
          this.loading = false;
          return;
        }

        let zipcodes = "";
        //for each value in areas, push value.locations (which is an array) into zipcodes
        if (this.allAreas) zipcodes = "all";
        else {
          zipcodes = [];
          this.areas.forEach((value) => {
            zipcodes.push(...value.locations);
          });
        }
        let date = new Date();
        // date.setDate(date.getDate() + (this.day - this.today));
        const availability = {
          ...this.availability,
          date: this.availability?.uuid
            ? this.availability?.date
            : date.toISOString(),
          startTime: this.startTime,
          endTime: this.endTime,
          zipcodes,
          meetingDuration: this.meetingDuration,
          areas: this.areas,
          timezone: this.timezone,
          smart: this.smart,
        };

        if (
          !availability.startTime ||
          !availability.endTime ||
          !availability.meetingDuration ||
          !availability.timezone
        ) {
          this.$q.notify({
            message: "Please fill out all required fields",
            color: "negative",
            position: "top",
            timeout: 2000,
          });
          this.loading = false;
          this.allAreas = false;

          return;
        }

        if (
          this.$api.utils.timeToNumber(availability.startTime) >
          this.$api.utils.timeToNumber(availability.endTime)
        ) {
          this.$q.notify({
            message: "Start time must be before end time",
            color: "negative",
            position: "top",
            timeout: 2000,
          });
          this.loading = false;

          return;
        }

        window._cio.track("created_availability", {
          id: auth.currentUser.uid,
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          day: this.day || null,
        });

        this.$emit("add-availability", availability);
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async GetAreas() {
      const uid = auth.currentUser.uid;
      const { success, message, areas } = await this.$api.areas.GetUserAreas(
        uid
      );
      if (!success) {
        return this.$q.notify({
          message,
          color: "negative",
          position: "top",
          timeout: 2000,
        });
      }
      this.areaOptions = [...areas];
      if (this.areas.length === 0) {
        this.areas = [...areas];
      }
      if (this.areaOptions.length === 0) {
        this.showAddLocation = true;
      }
    },
    editArea(item) {
      this.areaToEdit = { ...item };
      this.showManageAreas = false;
      this.showAddLocation = true;
    },
    async deleteArea(id) {
      await this.$api.areas.DeleteArea(id);
      //remove this area from all areaOptions
      this.areaOptions = this.areaOptions.filter((area) => area.id !== id);
      //remove this area from all areas
      this.areas = this.areas.filter((area) => area.id !== id);
      this.$q.notify({
        message: "Location deleted",
        color: "positive",
        position: "top",
        timeout: 2000,
      });
      if (this.areaOptions.length === 0) {
        this.showAddLocation = true;
        this.showManageAreas = false;
      }
    },
    handleCalendarChange(date) {
      this.selectedDate = date;
    },
    async manageAreaAction() {
      await this.GetAreas();

      this.showAddLocation = false;
      if (this.areaOptions.length === 0) {
        return this.$emit("cancel");
      }
    },
  },
};
</script>
