<template>
  <div v-if="loading" class="fullscreen row items-center justify-center">
    <q-spinner-oval color="primary" size="10em" />
  </div>
  <router-view v-else />
</template>

<script>
import { defineComponent, onUnmounted, ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "boot/firebase";
export default defineComponent({
  name: "App",
  setup() {
    const loading = ref(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.setItem("user", "");
      }
      loading.value = false;
    });
    onUnmounted(() => {
      unsubscribe();
    });
    return {
      loading,
    };
  },
});
</script>
