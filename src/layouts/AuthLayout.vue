<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth } from "src/boot/firebase";
export default {
  name: "AuthLayout",
  mounted() {
    //if (auth?.currentUser?.uid != undefined) this.$router.push("/");
  },
};
</script>
