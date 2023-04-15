<template>
  <div>
    <div>Your upcoming appointments ({{ this.sortedAppointment.length }})</div>
    <q-table
      flat
      bordered
      outline
      :rows="sortedAppointment"
      :columns="columns"
      @row-click="selectAppointment"
      hide-pagination
      row-key="id"
      class="schedule-table br-10 q-mt-sm"
      no-data-label="No upcoming appointments"
    />
  </div>
</template>

<script>
export default {
  name: "AppointmentTable",
  props: {
    appointments: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    sortedAppointment() {
      //take into account both date and time
      return this.appointments
        .filter((ap) => {
          const apDate = new Date(ap.date);
          apDate.setHours(ap.startTime.split(/[\s:]/)[0]);
          apDate.setMinutes(ap.startTime.split(/[\s:]/)[1]);
          return apDate > new Date();
        })
        .sort((a, b) => {
          if (new Date(a.date) === new Date(b.date)) {
            return (
              this.$api.utils.timeToNumber(a.startTime) -
              this.$api.utils.timeToNumber(b.startTime)
            );
          } else {
            return new Date(a.date) - new Date(b.date);
          }
        });
    },
  },
  data() {
    return {
      columns: [
        {
          name: "Date",
          label: "Date",
          field: (row) =>
            new Date(row.date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            }),
          align: "left",
          sortable: true,
        },
        {
          name: "Time",
          label: "Time",
          field: "startTime",
          align: "left",
          sortable: true,
        },
        {
          name: "Location",
          label: "Location",
          field: "zipcode",
          align: "left",
          sortable: true,
        },

        {
          name: "Duration",
          label: "Duration",
          field: (row) => row.duration.label,
          align: "left",
          sortable: true,
        },
        /*
        {
          name: "Notes",
          label: "Notes",
          field: "notes",
          align: "left",
          sortable: true,
        },*/
        {
          name: "Phone",
          label: "Phone",
          field: "phoneNumber",
          align: "left",
          sortable: true,
        },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: "date",
        descending: false,
      },
    };
  },
  methods: {
    selectAppointment(evt, row) {
      this.$emit("select", row);
    },
  },
};
</script>

<style scoped>
@media (max-width: 600px) {
  .schedule-table {
    width: 90%;
    overflow-x: auto;
  }
}
</style>
