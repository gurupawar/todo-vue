<template>
  <v-app class="bg-grey-lighten-5">
    <!-- Header  -->
    <Header />
    <!--  Add TODO Button  -->
    <div class="wrapper">
      <v-container class="my-auto">
        <v-row
          class="d-flex justify-center justify-md-end mx-auto"
          style="max-width: 1200px"
        >
          <v-btn
            inline-block
            max-width="100px"
            color="blue-grey-darken-3"
            @click="compose({})"
            >New
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
        </v-row>
      </v-container>

      <!-- Pop Up Component for Adding Todo -->
      <v-dialog v-model="dialogCompose" width="500">
        <v-card>
          <v-card-title class="headline black" primary-title>
            Add your todo
          </v-card-title>
          <v-card-text class="pa-5">
            <v-form>
              <v-text-field
                label="Title *"
                hide-details="auto"
                class="mb-2"
                v-model="newTodo"
              ></v-text-field>
              <v-textarea
                outlined
                name="input-7-4"
                label="Task *"
                v-model="newTask"
              ></v-textarea>
              <ErrorMessage :err_show="err_show" :err_message="err_message" />
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-5">
            <v-btn class="ml-auto" @click="cancelPop()" outlined color="red"
              >Cancel</v-btn
            >
            <v-btn
              color="blue-grey-darken-3"
              class="custom_btn"
              @click="addTodo"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Loading Circle  -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mx-auto"
    ></v-progress-circular>

    <!-- Todo Card Component  -->
    <Card :todosList="todosList" />

    <!-- Notification -->
    <v-snackbar v-model="snackbar" :timeout="2000" color="success">
      {{ this.err_message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import Card from "../components/Card.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

import { auth, db } from "../firebase/init";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  query,
} from "firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";

export default {
  components: {
    Header,
    Card,
    ErrorMessage,
  },
  data() {
    return {
      todosList: [],
      newTodo: "",
      newTask: "",
      err_show: false,
      err_message: "",
      dialogCompose: false,
      loading: true,
      snackbar: false,
    };
  },

  methods: {
    // Add Todo Method
    async addTodo() {
      console.log("add todo function");
      if (this.newTodo != "" && this.newTask != "") {
        // Check if a user is logged in
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;

          // Create a reference to the "users" collection
          const usersRef = collection(db, "users");

          // Create a reference to the document with the current user's ID
          const userDocRef = doc(usersRef, userId);

          // Create a reference to the "todos" subcollection within the user's document
          const todosRef = collection(userDocRef, "todos");

          // Store a new todo in the "todos" subcollection
          await addDoc(todosRef, {
            title: this.newTodo,
            task: this.newTask,
            createdAt: serverTimestamp(),
          })
            .then((docRef) => {
              console.log("Todo stored with ID: ", docRef.id);
              this.newTask = "";
              this.newTodo = "";
              this.err_show = false;
              this.dialogCompose = false;
              this.snackbar = true;
              this.err_message = "New todo created ✨";
            })
            .catch((error) => {
              console.error("Error storing todo: ", error);
            });
        }
      } else if (
        (this.newTodo != "" && this.newTask == "") ||
        (this.newTodo == "" && this.newTask != "") ||
        (this.newTask == "" && this.newTodo == "")
      ) {
        this.err_message = "Please complete all required fields 😒";
        this.success_show = false;
        this.err_show = true;
      }
    },

    // For Add Todo PopUp
    compose() {
      this.dialogCompose = true;
    },
    cancelPop() {
      this.dialogCompose = false;
    },
  },

  async mounted() {
    // Fetching realtime todos from firestore
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const usersRef = collection(db, "users");
        const userDocRef = doc(usersRef, userId);
        const todosRef = collection(userDocRef, "todos");
        const q = query(todosRef);
        onSnapshot(q, (snapshot) => {
          const todos = [];
          snapshot.forEach((doc) => {
            const todo = {
              id: doc.id,
              ...doc.data(),
            };
            todos.push(todo);
          });
          this.todosList = todos;
          this.loading = false;
        });
      }
    });
  },
};
</script>

<style>
.wrapper {
  margin: 6rem;
}
</style>