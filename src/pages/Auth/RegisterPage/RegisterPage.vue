<template>
  <q-page>
    <div class="container">
      <div class="panel">
        <img src="../../../assets/Logo/logo.svg" height="40" />

        <q-card flat bordered class="section q-pa-xl br-10 q-mt-md">
          <q-card-section
            class="heading-one text-center"
            data-test-id="register-title"
          >
            Register
          </q-card-section>
          <q-card-section class="form q-gutter-y-md q-mt-sm">
            <q-input
              class="main-text-input"
              v-model="name"
              color="primary"
              label="First Name"
              dense
              filled
              data-test-id="name-input"
            />
            <q-input
              class="main-text-input"
              v-model="email"
              color="primary"
              label="Email"
              dense
              filled
              data-test-id="email-input"
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
            <q-input
              data-test-id="password-input"
              class="main-text-input"
              v-model="password2"
              color="primary"
              label="Confirm Password"
              :type="passwordVisible2 ? 'text' : 'password'"
              dense
              filled
            >
              <template v-slot:append>
                <q-icon
                  name="visibility"
                  class="cursor-pointer"
                  @click="passwordVisible2 = !passwordVisible2"
                >
                  <q-tooltip>Toggle password visibility</q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <div class="text-center">
              <q-btn
                no-caps
                flat
                class="primary-button"
                label="Register"
                @click="Register"
                :disable="loading || !email || !name"
                :loading="loading"
                data-test-id="button"
              />
            </div>
          </q-card-section>
          <div class="q-mt-md text-center">
            Already have an account?
            <span
              class="text-underline text-bold clickable"
              @click="GoToLogIn()"
              data-test-id="register-login-link"
            >
              Log In
            </span>
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
      name: "",
      password: "",
      password2: "",
      passwordVisible: false,
      passwordVisible2: false,
      loading: false,
    };
  },
  watch: {
    email() {
      this.email = this.email.toLowerCase(); //force email lowercase
    },
  },
  methods: {
    GoToLogIn() {
      this.$router.push("/auth/login");
    },
    async Register() {
      this.loading = true;

      //Validate passwords match
      if (this.password !== this.password2) {
        this.$q.notify({
          message: "Passwords do not match",
          color: "negative",
          position: "top",
        });
        this.loading = false;
        return;
      }

      this.$q.notify({
        type: "ongoing",
        message: "Registering user...",
        timeout: 100,
      });

      //validate email is an email
      const emailRegex = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
      );

      if (!emailRegex.test(this.email)) {
        this.$q.notify({
          message: "Invalid email",
          color: "negative",
          position: "top",
        });
        this.loading = false;
        return;
      }

      const res = await this.$api.auth.CreateUser({
        email: this.email,
        fname: this.name.split(" ")[0] || this.name,
        password: this.password,
      });
      this.loading = false;

      if (res?.success) {
        return this.$q.notify({
          message: res.message,
          color: "negative",
          position: "top",
        });
      } else {
        this.$q.notify({
          message: "Account created successfully",
          color: "positive",
          position: "top",
        });
        this.registered = true;
      }

      this.$router.push("/?onboarding=true");
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
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
