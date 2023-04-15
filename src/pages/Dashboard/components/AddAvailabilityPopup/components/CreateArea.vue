<template>
  <q-form class="q-mx-md form">
    <div class="heading-two q-mt-md text-grey-8">Add one or more regions</div>
    <div class="body-text-caption q-mt-lg">
      Easily define cities / zip codes and the radius around those that you will
      be available in to quickly build your schedules for upcoming weeks
    </div>
    <q-input
      v-model="zipcode"
      label="Enter Zip Code"
      type="number"
      color="primary"
      filled
      dense
      class="q-mt-md"
    />
    <div class="q-mt-md body-text text-grey-8">or</div>
    <div class="row q-gutter-x-md">
      <q-select
        v-model="state"
        label="Select State"
        option-label="name"
        :option-value="isoCode"
        color="primary"
        :options="states"
        filled
        dense
        class="q-mt-md col"
        @click="clickState"
      >
        <q-tooltip v-if="plan === 'free'">
          Upgrade your plan to add by city</q-tooltip
        >
        <template v-slot:append v-if="state.name != ''">
          <q-icon name="las la-times-circle" @click="state = { name: '' }" />
        </template>
      </q-select>

      <q-select
        :disable="state?.name === '' || state?.name === undefined"
        v-model="citiesSelected"
        label="Select City"
        option-label="name"
        :option-value="isoCode"
        color="primary"
        :options="cities"
        filled
        multiple
        use-chips
        dense
        class="q-mt-md col"
      >
        <template v-slot:append v-if="citiesSelected != []">
          <q-icon name="las la-times-circle" @click="citiesSelected = []" />
        </template>
      </q-select>
    </div>
    <div v-if="zipcode.length > 0">
      <div class="q-mt-xl text-grey-8 body-text-caption text-center">
        Adding Radiuses is a great way to account for minor outlying areas to
        make sure you maximize bookings - this will add the zip code you typed
        and all other zip codes within that distance
      </div>
      <q-select
        v-model="radius"
        label="Add Radius (miles)"
        color="primary"
        :options="radiusOptions"
        filled
        dense
        class="q-mt-md"
      />
    </div>
    <q-btn
      class="primary-button q-mt-md"
      no-caps
      flat
      label="Add To Area"
      :disable="!isZipcodeSearch() && !isCitySearch()"
      :loading="loading"
      @click="addLocation"
    />
  </q-form>
</template>

<script>
import { State, City } from "country-state-city";
import { auth } from "src/boot/firebase";

export default {
  name: "CreateArea",
  props: {
    plan: String,
  },
  data() {
    return {
      zipcode: "",
      state: { name: "" },
      citiesSelected: [],
      radius: { value: 0, label: "0 miles" },
      loading: false,
      radiusOptions: [
        { label: "0 miles", value: 0 },
        { label: "5 miles", value: 5 },
        { label: "10 miles", value: 10 },
        { label: "20 miles", value: 20 },
        { label: "50 miles", value: 50 },
      ],
    };
  },
  computed: {
    cities() {
      return this.getCities();
    },
    states() {
      return this.getStates();
    },
  },

  methods: {
    clickState() {
      return;
    },
    isZipcodeSearch() {
      console.log(
        this.zipcode !== "" &&
          (this.state?.name === undefined || this.state?.name === "") &&
          this.citiesSelected === []
      );
      return (
        this.zipcode !== "" &&
        (this.state?.name === undefined || this.state?.name === "")
      );
    },
    isCitySearch() {
      return (
        this.zipcode === "" &&
        this.state?.name != undefined &&
        this.state?.name != "" &&
        this.citiesSelected != []
      );
    },
    async addLocation() {
      this.loading = true;
      const isZipSearch = this.isZipcodeSearch();
      const isCitySearch = this.isCitySearch();

      if (!isZipSearch && !isCitySearch) {
        this.$q.notify({
          message: "Please enter a zip code or select a city",
          color: "negative",
          position: "top",
        });
        this.loading = false;
        return;
      }

      if (isZipSearch && this.zipcode.length !== 5) {
        this.$q.notify({
          message: "Please enter a valid zip code",
          color: "negative",
          position: "top",
        });
        this.loading = false;
        return;
      }

      if (isCitySearch && this.citiesSelected === []) {
        this.$q.notify({
          message: "Please select a city",
          color: "negative",
          position: "top",
        });
        this.loading = false;
        return;
      }

      if (isCitySearch && this.state.name === "") {
        this.$q.notify({
          message: "Please select a state",
          color: "negative",
          position: "top",
        });
        this.loading = false;
        return;
      }
      if (isCitySearch && (this.plan === "free" || this.plan === undefined)) {
        this.$q.notify({
          message: "Upgrade your plan to add by city",
          color: "negative",
          position: "top",
        });
        this.loading = false;
        return;
      }

      //check user is allowed to add more locations
      const [areas] = await Promise.all([
        // this.$api.auth.GetUser(auth.currentUser.uid),
        this.$api.areas.GetUserAreas(auth.currentUser.uid),
      ]);

      if (this.plan === "free" || this.plan === undefined) {
        //free user. max 2 areas
        if (areas.length >= 2) {
          window._cio.track("max_areas", {
            id: user.uid,
            email: user.email,
            first_name: user?.fname || "",
            uid: user.uid,
            subscription: "free",
          });

          this.$q.notify({
            message: "You have reached the maximum number of areas",
            color: "negative",
            position: "top",
          });
          this.loading = false;
          return;
        }
      } else if (this.plan === "lite") {
        window._cio.track("max_areas", {
          id: user.uid,
          email: user.email,
          first_name: user?.fname || "",
          uid: user.uid,
          subscription: "lite",
        });

        //max 10 areas
        if (areas.length >= 10) {
          this.$q.notify({
            message: "You have reached the maximum number of areas",
            color: "negative",
            position: "top",
          });
          this.loading = false;
          return;
        }
      }

      let body = {
        type: "",
        location: { city: "", state: "", zipcode: "" },
        radius: 0,
      };

      if (isZipSearch) {
        console.log("to here");
        body.type = "zipcode";
        body.location.zipcode = this.zipcode;
        body.radius = this.radius.value;

        if (body.radius === 0) {
          this.$emit("add-location", [this.zipcode]);
          this.resetForm();
          this.loading = false;
          return;
        } else {
          const { zip_codes } = await this.$api.maps.GetZipCodesInRadius(body);
          this.$emit("add-location", zip_codes);
        }
      } else if (isCitySearch) {
        console.log("stuck here");
      } else {
        this.loading = false;
        return this.$q.notify({
          message: "Please enter a zip code or select a city",
          color: "negative",
          position: "top",
        });
      }

      for (var i = 0; i < this.citiesSelected.length; i++) {
        body.type = "city";
        body.location.city = this.citiesSelected[i].name;
        body.location.state = this.state.isoCode;
        const { zip_codes } = await this.$api.maps.GetZipCodesInRadius(body);
        this.$emit("add-location", zip_codes);
      }

      this.resetForm();
      this.loading = false;
    },

    getStates() {
      this.zipcode = "";
      let states = State.getStatesOfCountry("US");
      states.sort((a, b) => a.name.localeCompare(b.name));
      return states;
    },
    getCities() {
      this.zipcode = "";
      let cities = City.getCitiesOfState("US", this.state.isoCode);
      cities.sort((a, b) => a.name.localeCompare(b.name));
      return cities;
    },
    resetForm() {
      this.zipcode = "";
      this.state = { name: "" };
      this.citiesSelected = [];
      this.radius = { value: 0, label: "0 miles" };
    },
  },
};
</script>

<style scoped>
.form {
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 16px;
  padding-bottom: 24px;
  padding-right: 16px;
  padding-left: 16px;
}
</style>
