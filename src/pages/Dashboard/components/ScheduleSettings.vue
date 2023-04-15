<template>
  <q-card class="popup-card br-10">
    <q-card-section class="q-pb-sm">
      <div class="heading-two text-center">Manage Schedule</div>
      <div class="q-pl-md q-mb-xs q-pb-none body-text row">
        Edit Link
        <div class="q-ml-xs">
          <q-btn
            icon="las la-pen"
            rounded
            flat
            dense
            size="xs"
            class="body-text-bold"
            no-caps
            @click="setEditUsername"
          />
        </div>
      </div>
      <div class="q-pl-md q-pt-none">
        <div class="row justify-between" v-if="editUsername">
          <div class="col-7">
            <q-input
              dense
              filled
              outlined
              :prefix="baseUrl"
              v-model="myUsername"
              label="Username"
            />
          </div>

          <div class="q-ml-xs col-4">
            <q-btn
              label="Save"
              rounded
              dense
              flat
              class="body-text-bold primary-button"
              no-caps
              @click="saveUsername"
            />
          </div>
        </div>
        <div class="row" v-else>
          <div class="link-container row">
            <div>{{ baseUrl + myUsername }}</div>
            <div class="clickable q-ml-md" @click="copyToClipboard">
              <q-icon name="las la-copy" />
            </div>
          </div>
        </div>
      </div>
      <div class="q-pa-md">
        <div class="body-text">Manage Integrations</div>
        <div class="row">
          <q-btn
            v-if="!editWebhook"
            class="primary-button"
            no-caps
            flat
            @click="editWebhook = !editWebhook"
          >
            {{ !schedule?.webhookUrl ? "Setup" : "Edit" }} webhook integration
          </q-btn>
          <!--<div
            class="body-text-caption q-pt-sm q-pl-lg"
            v-if="schedule?.webhookUrl && !editWebhook"
          >
            Send test data to webhook
          </div>-->
        </div>

        <form
          @submit.prevent.stop="onSubmit"
          @reset.prevent.stop="onReset"
          class="q-gutter-md"
          v-if="editWebhook"
        >
          <div class="row">
            <div class="col-8 col-md-6">
              <q-input
                ref="webhookUrlRef"
                filled
                dense
                v-model="webhookUrl"
                label="Enter Webhook URL"
                lazy-rules
                :rules="webhookUrlRules"
              />
            </div>
            <div class="col-12 col-md-10 row">
              <div>
                <q-btn
                  label="Save"
                  type="submit"
                  no-caps
                  flat
                  class="q-ml-md primary-button"
                  @click="saveWebhook"
                />
              </div>
              <div>
                <q-btn
                  label="Cancel"
                  type="submit"
                  no-caps
                  flat
                  class="q-ml-md secondary-button"
                  @click="editWebhook = !editWebhook"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { auth } from "boot/firebase";
import { useStore } from "vuex";

export default {
  name: "ScheduleSettings",
  props: {
    plan: {
      type: String,
    },
    username: {
      type: String,
    },
    schedule: {
      type: Object,
    },
  },
  data() {
    return {
      myUsername: "",
      editUsername: false,
      webhookUrl: "",
      editWebhook: false,
      baseUrl: "https://omw.li/",
      webhookUrlRef: "",
      webhookUrlRules: [
        (val) => (val && val.length > 0) || "Please enter webhook URL",
        (val) => val.match(this.urlRegex) || "Please enter valid URL",
      ],
    };
  },
  computed: {
    plan() {
      const $store = useStore();
      return $store.state.user.plan;
    },
    urlRegex() {
      return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    },
  },
  mounted() {
    this.myUsername = this.username;
    this.webhookUrl = this.schedule?.webhookUrl;
  },

  methods: {
    setEditUsername() {
      console.log("plann", this.plan);
      if (this.plan === "free" || this.plan === undefined) {
        console.log("woah");
        const user = auth.currentUser;
        window._cio.track("attempt_edit_username", {
          username: this.myUsername,
          email: user.email,
          uid: user.uid,
        });
        this.$q.notify({
          message: "Please upgrade to change your link",
          color: "negative",
          position: "top",
        });
        return;
      }
      this.editUsername = true;
    },
    saveUsername() {
      //validate username has only hyphens or underscores. no spaces. just letters numbers hyphen underscore and periods
      const re = /^[a-zA-Z0-9_.-]*$/;
      if (!re.test(this.myUsername)) {
        return this.$q.notify({
          message:
            "Username can only contain letters, numbers, hyphens, underscores and periods",
          color: "negative",
          position: "top",
        });
      }

      this.$emit("update", this.myUsername);
      this.editUsername = false;
    },
    copyToClipboard() {
      // const valueToCopy = `https://prorouting.ai/s/${username}`;
      const valueToCopy = `${this.baseUrl}${this.myUsername}`;
      navigator.clipboard.writeText(valueToCopy);
      this.$q.notify({
        message: "Copied to clipboard",
        color: "primary",
        textColor: "white",
        icon: "done",
        position: "top",
      });
    },
    async sendWebhook() {
      if (this.webhookUrl) {
        const param = {
          webhookUrl: this.webhookUrl,
          userId: auth.currentUser.uid,
        };
        await this.$api.scheduling.sendWebhook(param);
      }
    },
    async saveWebhook() {
      if (!this.webhookUrl) return (this.editWebhook = false);
      await this.$api.scheduling.saveWebhook(this.schedule.id, this.webhookUrl);
      this.editWebhook = false;
      this.schedule.webhookUrl = this.webhookUrl;
    },
  },
};
</script>

<style>
.q-field__messages [role="alert"] {
  margin-bottom: 8px;
}
.submitBtn,
.sendTest {
  height: 50px;
}
.link-container {
  display: flex;
  align-items: center;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 14px;
  color: #424242;
  background-color: #f5f5f5;
}
</style>
