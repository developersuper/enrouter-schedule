<template>
  <div class="chip-container">
    <div v-for="item in value">
      <q-chip
        removable
        @remove="removeZip(item)"
        color="accent"
        text-color="primary"
      >
        {{ item }}
      </q-chip>
    </div>
  </div>
</template>

<script>
import { auth } from "src/boot/firebase";
export default {
  name: "ArrayInput",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    plan: {
      type: String,
    },
  },
  data() {
    return {
      subscriptionType: "",
    };
  },
  // async mounted() {
  //   const res = await this.$api.auth.GetUser(auth.currentUser.uid);
  //   this.subscriptionType = res.user?.subscription?.type;
  // },
  methods: {
    removeZip(zip) {
      if (this.plan === "free" || this.plan === undefined) {
        window._cio.track("attempted_removal_of_zipcode", {
          id: auth.currentUser.uid,
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          zipcode: zip,
        });

        //is free user, can't remove
        this.$q.notify({
          message: "You must upgrade to customize areas",
          color: "negative",
          position: "top",
        });
        return this.$emit("upgrade");
      }
      this.$emit(
        "input",
        this.value.filter((item) => item !== zip)
      );
    },
  },
};
</script>

<style scoped>
.chip-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
}

.chip-container .q-chip {
  margin: 5px;
}
</style>
