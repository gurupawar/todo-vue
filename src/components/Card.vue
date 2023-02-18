<template>
  <v-container>
    <v-row style="max-width: 1200px" class="mx-auto">
      <v-col
        h-screen
        v-for="todo in todosList"
        :key="todo.title"
        cols="12"
        sm="4"
      >
        <v-card class="h-100 d-flex flex-column justify-space-between">
          <v-card-title class="text-wrap">{{ todo.title }}</v-card-title>
          <v-divider></v-divider>
          <!-- date and time  -->
          <v-card-subtitle class="mt-2" v-if="todo.createdAt != null"
            >{{
              todo.createdAt.toDate().toLocaleString("en-us", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            }}
            -
            {{
              todo.createdAt.toDate().getHours() +
              ":" +
              todo.createdAt.toDate().getMinutes()
            }}
          </v-card-subtitle>

          <v-card-text> {{ todo.task }} </v-card-text>

          <v-card-actions>
            <!-- Edit Todo Button  -->
            <v-btn
              icon
              color="blue-grey-darken-3"
              @click="editTodo(todo.id, todo.title, todo.task)"
            >
              <v-icon>mdi-pen</v-icon>
            </v-btn>
            <!-- Delete Button  -->
            <v-btn icon color="red" @click="deleteTodo(todo.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Update Todo Pop Up  -->
  <v-dialog v-model="dialogCompose" width="500">
    <v-card>
      <v-card-title class="headline black" primary-title>
        Edit todo
      </v-card-title>
      <v-card-text class="pa-5">
        <!-- Update todo form  -->
        <v-form>
          <v-text-field
            label="Title *"
            hide-details="auto"
            class="mb-2"
            v-model="updateTitle"
          ></v-text-field>
          <v-textarea
            outlined
            name="input-7-4"
            label="Task *"
            v-model="updateTask"
          ></v-textarea>

          <!-- Error comp while updating todo -->
          <ErrorMessage :err_show="err_show" :err_message="err_message" />
        </v-form>
      </v-card-text>

      <!-- Cancel and Update Button  -->
      <v-card-actions class="pa-5">
        <v-btn class="ml-auto" @click="cancelPop()" outlined color="red"
          >Cancel</v-btn
        >
        <v-btn
          color="blue-grey-darken-3"
          class="custom_btn"
          @click="updateTodo"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Notification Popup -->
  <v-snackbar v-model="snackbar" :timeout="2000" color="success">
    {{ this.err_message }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { doc, deleteDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/init";
import ErrorMessage from "./ErrorMessage.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Card",
  components: {
    ErrorMessage,
  },
  props: {
    todosList: Array,
  },

  data() {
    return {
      dialogCompose: false,
      updateTitle: "",
      updateTask: "",
      todoId: "",
      err_show: false,
      err_message: "",
      snackbar: false,
    };
  },
  methods: {
    // Update todo function
    async updateTodo() {
      if (this.updateTitle != "" && this.updateTask != "") {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const usersRef = collection(db, "users");
          const userDocRef = doc(usersRef, userId);
          const todosRef = collection(userDocRef, "todos");
          const todoDocRef = doc(todosRef, this.todoId);

          // Update the todo document
          updateDoc(todoDocRef, {
            title: this.updateTitle,
            task: this.updateTask,
          })
            .then(() => {
              console.log("Todo updated successfully");
              this.dialogCompose = false;
              this.err_show = false;
              this.snackbar = true;
              this.err_message = "Todo updated...😉";
            })
            .catch((error) => {
              console.error("Error updating todo: ", error);
            });
        }
      } else if (this.updateTitle == "" || this.updateTask == "") {
        console.log("can not blank");
        this.err_show = true;
        this.err_message = "Field cannot be blank";
      }
    },
    // Delete Todo by id
    deleteTodo(todoId) {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const usersRef = collection(db, "users");
        const userDocRef = doc(usersRef, userId);
        const todosRef = collection(userDocRef, "todos");
        const todoDocRef = doc(todosRef, todoId);

        deleteDoc(todoDocRef)
          .then(() => {
            console.log("Todo deleted");
            this.snackbar = true;
            this.err_message = "Todo deleted...✌";
          })
          .catch((error) => {
            console.error("Error deleting todo: ", error);
          });
      }
    },

    // Edit Todo Function
    editTodo(id, title, task) {
      this.dialogCompose = true;
      this.updateTitle = title;
      this.updateTask = task;
      this.todoId = id;
    },

    // Update Todo Popup
    compose() {
      this.dialogCompose = true;
    },
    cancelPop() {
      this.dialogCompose = false;
    },
  },
};
</script>
<style>
</style>