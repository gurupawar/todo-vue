<template>
  <v-app-bar app color="blue-grey-darken-3" dark flat class="px-md-16 px-2">
    <!-- Logo -->
    <v-btn>
      <router-link to="/">TODO</router-link>
    </v-btn>
    <v-spacer></v-spacer>
    <!-- Logout  -->
    <router-link to="/">
      <v-btn class="white--text" to="/" @click="handleLogOut"> Logout </v-btn>
    </router-link>
  </v-app-bar>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Header",
  data() {
    return {
      user: "",
    };
  },
  methods: {
    // Logout Method
    handleLogOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log("logged out");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>