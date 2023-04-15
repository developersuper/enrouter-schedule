<template>
  <q-page>
    <div class="container">
      <div class="panel">
        <div class="logo">
          <img src="../../../assets/Logo/logo.svg" height="40" />
        </div>
        <q-card flat bordered class="section q-pa-xl br-10">
          <q-card-section class="heading-one text-center">Login</q-card-section>
          <q-card-section class="form q-gutter-y-md q-mt-sm">
            <q-input
              data-test-id="email-input"
              class="main-text-input"
              v-model="email"
              color="primary"
              label="Email"
              dense
              filled
            />
            <q-input
              data-test-id="password-input"
              class="main-text-input"
              v-model="password"
              color="primary"
              label="Password"
              :type="passwordVisible ? 'text' : 'password'"
              dense
              filled
            >
              <template v-slot:append>
                <q-icon
                  name="visibility"
                  class="cursor-pointer"
                  @click="passwordVisible = !passwordVisible"
                >
                  <q-tooltip>Toggle password visibility</q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <div class="text-center">
              <q-btn
                data-test-id="login-button"
                no-caps
                flat
                class="primary-button"
                label="Log In"
                @click="Login()"
                :disable="loading || !email || !password"
                :loading="loading"
              />
            </div>
          </q-card-section>

          <div class="q-mt-md text-center">
            New to ProRouting?
            <span
              class="text-underline text-bold clickable"
              @click="GoToRegister()"
              >Register</span
            >
          </div>
          <div class="text-center">
            <span
              class="text-underline body-text-small-caption text-bold clickable"
              @click="GoToForgetPassword()"
              >Forgot Password?</span
            >
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      passwordVisible: false,
    };
  },
  watch: {
    email() {
      this.email = this.email.toLowerCase(); //force email lowercase
    },
  },
  methods: {
    GoToRegister() {
      this.$router.push("/auth/register");
    },
    GoToForgetPassword() {
      this.$router.push("/auth/forgot-password");
    },
    async Login() {
      try {
        this.loading = true;
        this.$q.notify({
          type: "ongoing",
          message: "Logging in...",
          timeout: 100,
        });

        const { message, success } =
          await this.$api.auth.SignInWithEmailAndPassword(
            this.email,
            this.password
          );
        this.loading = false;

        if (!success) {
          return this.$q.notify({
            message,
            color: "negative",
            position: "top",
            timeout: 2000,
          });
        }

        this.$router.push("/");
      } catch (e) {
        this.loading = false;

        return this.$q.notify({
          message: "Something went wrong",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: -50px;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.panel {
  width: 100%;
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  padding-bottom: 15px;
}

.section {
  min-width: 500px;
  max-width: 90%;
}

@media only screen and (max-width: 600px) {
  .container {
    flex-direction: column;
  }

  .panel {
    max-width: none;
    height: auto;
  }

  .section {
    min-width: auto;
    max-width: none;
  }
}
</style>
