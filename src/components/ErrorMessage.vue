<template>
  <v-row v-if="err_show" class="custom_error mt-3">
    <v-col class="mx-auto">
      <v-alert dense outlined type="error">
        {{ this.err_message }}
      </v-alert>
    </v-col>
  </v-row>
  <v-row v-if="success_show" class="mx-auto custom_error">
    <v-col>
      <v-alert dense text type="success">
        {{ this.err_message }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "ErrorMessage",
  props: {
    err_show: Boolean,
    err_message: String,
    success_show: Boolean,
  },
};
</script>

<style>
</style>