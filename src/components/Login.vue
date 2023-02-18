<template>
  <v-card class="mx-auto py-10 px-10 mt-10" max-width="500" outlined>
    <!-- Error Message  -->
    <ErrorMessage :err_show="err_show" :err_message="err_message" />

    <!-- Login Form  -->
    <v-form v-model="formValidation">
      <v-card-title>Login</v-card-title>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        :error-messages="errorMessages"
        label="Email"
        placeholder="example@gmail.com"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required]"
        :type="showPass ? 'text' : 'password'"
        label="Password"
        counter
        @click:append-inner="showPass = !showPass"
      ></v-text-field>
    </v-form>
    <div class="ms-4 text-end">
      <router-link to="/register">Don't have account?</router-link>
    </div>

    <!-- Login Button  -->
    <v-card-actions>
      <v-btn :disabled="!formValidation" elevation="1" @click="login"
        >Login</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/init";
import router from "@/router";
import ErrorMessage from "./ErrorMessage.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  components: {
    ErrorMessage,
  },
  data() {
    return {
      email: "",
      password: "",
      err_show: false,
      err_message: "",
      errorMessages: "",
      showPass: false,
      formValidation: false,
      rules: {
        required: (value) => !!value || "Required is requred.",
      },
      emailRules: [
        (value) => {
          if (value) return true;

          return "E-mail is requred.";
        },
        (value) => {
          if (/.+@.+\..+/.test(value)) return true;

          return "E-mail must be valid.";
        },
      ],
    };
  },

  methods: {
    //  Login Method
    login() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          this.err_show = false;
          console.log("login successfull..");
          router.push("/alltodos");
        })
        .catch((err) => {
          console.log(err.message);
          this.err_message = err.message;
          this.err_show = true;
        });
    },
  },
};
</script>

<style>
</style>