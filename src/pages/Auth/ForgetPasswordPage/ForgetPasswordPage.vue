<template>
  <q-page>
    <div class="container">
      <div class="panel">
        <div class="logo">
          <img src="../../../assets/Logo/logo.svg" height="40" />
        </div>
        <q-card flat bordered class="section q-pa-xl br-10">
          <q-card-section class="heading-one text-center"
            >Forgot Password?</q-card-section
          >
          <q-card-section class="form q-gutter-y-md q-mt-sm">
            <q-input
              data-test-id="email-input"
              v-model="email"
              color="primary"
              label="Email"
              dense
              filled
            />
            <div class="q-mt-md text-center">
              <q-btn
                data-test-id="login-button"
                no-caps
                flat
                class="primary-button"
                :label="isVerificationSent ? 'Sent!' : 'Send Reset Link'"
                @click="sendPasswordResetEmail()"
                :disable="loading || !email || isVerificationSent"
                :loading="loading"
              />
            </div>
          </q-card-section>
          <div class="q-mt-md text-center">
            <span class="clickable" @click="GoToLogin()"> Back to Login </span>
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
      newPassword: "",
      verificationCode: "",
      loading: false,
      passwordVisible: false,
      isVerificationSent: false,
    };
  },
  watch: {
    email() {
      this.email = this.email.toLowerCase(); //force email lowercase
    },
  },
  methods: {
    GoToLogin() {
      this.$router.push("/auth/login");
    },
    async sendPasswordResetEmail() {
      try {
        this.loading = true;
        const { message, success } =
          await this.$api.auth.SendPasswordResetEmail(this.email);
        this.loading = false;
        if (!success) {
          return this.$q.notify({
            message,
            color: "negative",
            position: "top",
            timeout: 2000,
          });
        }

        this.$q.notify({
          message: "Verification email sent",
          color: "positive",
          position: "top",
          timeout: 2000,
        });

        // this.$router.push("/");
      } catch (e) {
        console.log(e);
        this.loading = false;
        return this.$q.notify({
          message: "Something went wrong",
          color: "negative",
          position: "top",
          timeout: 2000,
        });
      }
    },
    async confirmPasswordReset() {
      try {
        this.loading = true;
        const { message, success } = await this.$api.auth.ConfirmPasswordReset(
          this.email,
          this.verificationCode,
          this.newPassword
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
        this.$router.push("/auth/login");
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
