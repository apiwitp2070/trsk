<template>
  <v-app>
    <v-app-bar elevation="1" color="primary" title="TRSK">
      <template v-slot:append>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      elevation="1"
    >
    </v-navigation-drawer>
    <v-main>
      <v-container fluid class="container">
        <div class="mb-4">
          <v-row justify="center" align="center">
            <v-col>
              <div class="title">All Tasks</div>
            </v-col>
            <v-col cols="auto">
              <v-icon @click="isDeleteMode = !isDeleteMode">
                {{
                  isDeleteMode ? "mdi-delete-off-outline" : "mdi-delete-outline"
                }}
              </v-icon>
            </v-col>
          </v-row>
        </div>
        <div class="task-container">
          <div v-for="(item, index) in tasks" :key="item.id" class="py-3">
            <v-row>
              <v-col cols="12">
                <v-row
                  align="center"
                  no-gutters
                  v-touch="{
                    left: () => onSwipeLeft(item),
                    right: () => onSwipeRight(item),
                  }"
                >
                  <v-col cols="auto">
                    <v-badge
                      color="success"
                      inline
                      dot
                      :class="
                        item.status === Status.FINISH
                          ? 'dot-item-finish'
                          : 'dot-item'
                      "
                    />
                  </v-col>
                  <v-col>
                    <v-row justify="space-between">
                      <v-col
                        :class="
                          item.status === Status.FINISH
                            ? 'task-item-finish'
                            : 'task-item'
                        "
                      >
                        {{ item.task }}
                      </v-col>
                      <v-col cols="auto">
                        <v-row dense class="action-pannel">
                          <v-col v-if="item.status === Status.FINISH">
                            <v-icon size="small" color="success">
                              mdi-check
                            </v-icon>
                          </v-col>
                          <v-col
                            v-if="isDeleteMode"
                            @click="() => onClickDeleteTask(index)"
                          >
                            <v-icon size="small" color="red">
                              mdi-delete-outline
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <div><v-divider /></div>
              </v-col>
            </v-row>
          </div>
        </div>
        <v-row class="form-container">
          <v-col cols="12">
            <v-form>
              <v-text-field
                v-model="form.task"
                variant="underlined"
                placeholder="Add new task"
              >
                <template v-slot:append-inner>
                  <v-icon
                    @click="onClickAddNewTask"
                    :color="form.task ? 'primary' : 'disabled'"
                  >
                    mdi-plus
                  </v-icon>
                </template>
              </v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { cloneDeep } from "./plugins/function";

enum Status {
  ALL = "All",
  IN_PROGRESS = "In Progress",
  FINISH = "Finish",
  LATE = "Late",
}

interface Task {
  id: number;
  task: string;
  dueDate?: string;
  status: Status;
}

const LOCAL_KEY = "TASK_LIST";

const drawer = ref(false);

const isDeleteMode = ref(false);
const tasks = ref([] as Task[]);
const form = ref({
  task: "",
  dueDate: "",
  status: Status.IN_PROGRESS,
});

onMounted(() => {
  if (process.client) {
    console.log("get task from lcoalStorage");
    const localTask = localStorage.getItem(LOCAL_KEY);
    tasks.value = JSON.parse(localTask || "[]") as Task[];
  }
});

const onSwipeLeft = (item: Task) => {
  if (item.status === Status.FINISH) return;

  console.log("swipe left", item);
  item.status = Status.FINISH;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks.value));
};

const onSwipeRight = (item: Task) => {
  if (item.status === Status.FINISH) {
    console.log("swipe right");
    item.status = Status.IN_PROGRESS;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks.value));
  }
};

const onClickAddNewTask = () => {
  if (!form.value.task) {
    console.log("empty value");
    return;
  }

  const taskList = [...tasks.value, { id: Date.now(), ...form.value }];
  tasks.value = cloneDeep(taskList);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(taskList));
};

const onClickDeleteTask = (index: number) => {
  tasks.value.splice(index, 1);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks.value));
};
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 64px);
  overflow-y: scroll;
}

.title {
  font-size: 24px;
  font-weight: medium;
}

.task-container {
  max-height: calc(100vh - 230px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.form-container {
  position: sticky;
  bottom: 0;
  background: white;
}

.task-item,
.dot-item {
  transition: transform 0.3s ease;
}

.task-item-finish,
.dot-item-finish {
  transition: transform 0.3s ease;
  transform: translateX(-16px);
  color: rgba(
    var(--v-theme-on-background),
    var(--v-disabled-opacity)
  ) !important;
}

.dot-item-finish {
  visibility: hidden;
}

.action-pannel {
  padding-right: 2px;
}
</style>
