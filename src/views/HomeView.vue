<template>
  <Login/>
</template>

<script>
import Login from '@/components/Login.vue';
import { defineComponent } from 'vue';

// Components


export default defineComponent({
  name: 'HomeView',

  components: {
    Login,
  },
});
</script>
