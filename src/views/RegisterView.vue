<template>
  <v-card class="mx-auto py-10 px-10 mt-10" max-width="500" outlined>
    <!-- Error Message  -->
    <ErrorMessage :err_show="err_show" :err_message="err_message" />

    <!-- Register Form  -->
    <v-form v-model="formValidation">
      <v-card-title>Register</v-card-title>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        :error-messages="errorMessages"
        label="Email"
        placeholder="example@gmail.com"
        required
      ></v-text-field>

      <v-text-field
        class="text__Field"
        v-model="password"
        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
        :type="showPass ? 'text' : 'password'"
        label="Password"
        :hint="passwordRulesHint"
        counter
        @click:append-inner="showPass = !showPass"
      ></v-text-field>

      <v-text-field
        class="text__Field"
        v-model="confirmPassword"
        :append-inner-icon="showConPass ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="conPass"
        :type="showConPass ? 'text' : 'password'"
        label="Confirm Password"
        counter
        @click:append-inner="showConPass = !showConPass"
      ></v-text-field>
      <div class="ms-4 text-end">
        <router-link to="/">Want to login?</router-link>
      </div>

      <!-- Register Button -->
      <v-card-actions>
        <v-btn :disabled="!formValidation" elevation="1" @click="register"
          >Register</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>
 
 <script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/init";
import router from "@/router";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "RegisterView",
  components: {
    ErrorMessage,
  },
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      err_message: "",
      errorMessages: "",
      message: "",
      err_show: false,
      showPass: false,
      formValidation: false,
      showConPass: false,
      passwordRulesHint:
        "Password must contain uppercase, lowercase letter, one special symbol, one number and must be at least 6 characters long",

      //  Validation Rules
      rules: {
        required: (value) => !!value || "Required is requred.",
        min: (v) => v.length >= 6 || "Min 6 characters",
      },

      // Confirm Password Rules
      conPass: [
        (v) => !!v || "Required is requred.",
        (v) => v === this.password || "Passwords do not match",
      ],

      // Email Validation Rules
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

      // Password Validation Rules
      passwordRules: [
        (value) => !!value || "Password is required",
        (value) =>
          (value && value.length >= 6) ||
          "Password must be at least 6 characters",
        (value) =>
          /(?=.*\d)/.test(value) || "Password must contain at least one number",
        (value) =>
          /(?=.*[A-Z])/.test(value) ||
          "Password must contain at least one uppercase letter",
        (value) =>
          /(?=.*[a-z])/.test(value) ||
          "Password must contain at least one lowercase letter",
        (value) =>
          /(?=.*[!@#$%^&*])/.test(value) ||
          "Password must contain at least one special symbol",
      ],
    };
  },
  methods: {
    // Register User Function
    register() {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((credential) => {
          this.err_show = false;
          console.log(credential);
          router.push("/");
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

<style scoped>
</style>