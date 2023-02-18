@import './reset.scss';
@import './animations.scss';


<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onBeforeMount } from "vue";

export default {
  name: "App",

  setup() {
    const router = useRouter();
    const auth = getAuth();

    onBeforeMount(() => {
      // if user is not logged in then redirect user to "/" login page
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/");
          console.log("user is not logged in...");
        } else {
          console.log("logged user is :- " + user.email);
        }
      });
    });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
