<template>
  <div>
    <div>
      <q-btn
        label="Back"
        icon="las la-chevron-circle-left"
        dense
        flat
        class="secondary-button"
        no-caps
        @click="$emit('back')"
      />
      <div class="heading-two text-center q-mb-md">Manage Areas</div>
    </div>
    <div class="q-mb-md text-center">
      <q-btn
        class="primary-button"
        label="Add Area"
        no-caps
        flat
        @click="$emit('create-area')"
      />
    </div>

    <q-list class="br-10" bordered v-for="item in areas">
      <q-item>
        <q-item-section>
          <div class="body-text-small-bold">{{ item.name }}</div>
          <div class="body-text-small row">
            <div v-for="(zip, idx) in item.locations">
              {{ zip }}<span v-if="idx + 1 != item?.locations?.length">, </span>
            </div>
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="row">
            <q-btn icon="las la-pen" flat dense @click="$emit('edit', item)" />
            <q-btn
              icon="las la-trash"
              flat
              dense
              @click="$emit('delete', item.id)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  name: "ManageAreas",
  props: {
    areas: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
