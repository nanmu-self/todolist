<template>
  <div class="bg-pattern"></div>
  <div class="todo-wrapper">
    <div id="todo-app" class="todo-app">
      <div class="container header">
        <div class="todo-input">
          <h1 class="title">
            <img
              src="./assets/img/todo.svg"
              alt=""
              class="title-1"
              draggable="false"
            />
            <div class="ani-vector">
              <span></span>
              <span></span>
            </div>
            <div class="pendulums">
              <div class="pendulum">
                <div class="bar"></div>
                <div class="motion">
                  <div class="string"></div>
                  <div class="weight"></div>
                </div>
              </div>
              <div class="pendulum shadow">
                <div class="bar"></div>
                <div class="motion">
                  <div class="string"></div>
                  <div class="weight"></div>
                </div>
              </div>
            </div>
          </h1>
          <div class="add-content-wrapper">
            <input
              type="text"
              rows="3"
              class="add-content"
              :placeholder="t('App.newTodoPlaceholder')"
              v-model="newTodoTitle"
              @keyup.enter="addTodo"
              :class="{ empty: emptyChecked }"
            />
            <transition name="tips">
              <div class="tips" v-if="emptyChecked" style="color: red">
                {{ t("App.inputPrompt") }}
              </div>
            </transition>
            <button class="btn submit-btn" type="button" @click="addTodo">
              {{ t("App.submitButton") }}
            </button>
          </div>
        </div>
      </div>
      <div class="container main">
        <div class="todo-list-box">
          <Classification />
          <ul v-if="!todos.length" class="empty-tips">
            <li>{{ t("App.emptyTips.addFirst") }}</li>
            <li>{{ t("App.emptyTips.usage") }}</li>
            <li>✔️ {{ t("App.emptyTips.enterSubmit") }}</li>
            <li>✔️ {{ t("App.emptyTips.dragSort") }}</li>
            <li>✔️ {{ t("App.emptyTips.editInstruction") }}</li>
            <li>✔️ {{ t("App.emptyTips.quickActions") }}</li>
            <li>🔒 {{ t("App.emptyTips.dataStorage") }}</li>
            <li>📝 {{ t("App.emptyTips.importExport") }}</li>
          </ul>

          <transition-group
            name="drag"
            class="todo-list"
            tag="ul"
            mode="in-out"
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            :css="false"
            appear
          >
            <li
              v-for="(todo, index) in todos"
              :key="todo._id"
              class="todo-item"
              @dragenter="dragenter($event, index)"
              @dragover="dragover($event, index)"
              @dragstart="dragstart(index)"
              :data-delay="index * 150 * delayTime"
              v-show="show"
              :draggable="!(editedTodo !== null && editedTodo._id === todo._id)"
            >
              <div
                class="todo-content"
                :class="{ completed: todo.completed }"
                @dblclick="editdTodo(todo)"
              >
                {{ todo.title }}
              </div>
              <!-- 标记完成 -->
              <div
                class="todo-btn btn-finish"
                v-if="!todo.completed"
                @click="todo.completed = true"
              ></div>
              <!-- 标为未完成 -->
              <div
                class="todo-btn btn-unfinish"
                v-if="todo.completed"
                @click="todo.completed = false"
              >
                <img
                  src="./assets/img/checkmark.svg"
                  alt="标为未完成"
                  class="icon-finish"
                  draggable="false"
                />
              </div>

              <!-- 删除 -->
              <div
                class="todo-btn btn-delete"
                @click="store.removeTodo(todo._id)"
              >
                <img src="./assets/img/del.svg" alt="删除" draggable="false" />
              </div>
              <!-- 编辑 -->
              <div
                class="edit-todo-wrapper"
                v-if="editedTodo !== null && editedTodo._id === todo._id"
              >
                <input
                  type="text"
                  class="edit-todo"
                  value="编辑 Todo..."
                  v-if="editedTodo !== null && editedTodo._id === todo._id"
                  v-model="todo.title"
                  v-focus="true"
                  @keyup.enter="editDone(todo)"
                  @keyup.esc="cancelEdit(todo)"
                  @dragstart.stop.prevent
                  @mousedown.stop
                />
                <div class="todo-btn btn-edit-submit" @click="editDone(todo)">
                  <img
                    src="./assets/img/upsubmit.svg"
                    alt="提交"
                    draggable="false"
                  />
                </div>
              </div>
            </li>
          </transition-group>
          <ul class="pagination" v-if="pagedData.totalPages > 1">
            <li
              class="previous"
              v-if="pagedData.currentPage > 1"
              @click="store.changePage(pagedData.currentPage - 1)"
            >
              &lt;
            </li>
            <li
              v-for="item in pagedData.totalPages"
              :key="item"
              @click="store.changePage(item)"
              :class="{ active: item === pagedData.currentPage }"
            >
              {{ item }}
            </li>
            <li
              class="next"
              v-if="pagedData.currentPage < pagedData.totalPages"
              @click="store.changePage(pagedData.currentPage + 1)"
            >
              &gt;
            </li>
          </ul>
          <div class="bar-message bar-bottom">
            <div class="bar-message-text">
              <span v-if="unfinishedTodo.length > 0">
                {{
                  t("App.statusBar.remainingItems", {
                    count: unfinishedTodo.length,
                  })
                }}
              </span>
              <span v-else-if="completedTodosCount">
                {{ t("App.statusBar.allCompleted") }}
              </span>
            </div>
          </div>
        </div>

        <ActionMenu />
      </div>
      <PersonalInformation />
    </div>
  </div>
</template>
<script setup>
import PersonalInformation from "@/components/PersonalInformation.vue";
import Classification from "@/components/Classification.vue";
import ActionMenu from "@/components/ActionMenu.vue";
import { showMessageBox } from "@/utils/MessageBox.js";
import { update, create, get, del } from "@/api/todo.js";
import { ref, computed, onMounted } from "vue";
import { useDataStore } from "@/stores/userStore.js";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const store = useDataStore();
const { todos, selectedCategory, pagedData } = storeToRefs(store);

const newTodoTitle = ref("");
const checkEmpty = ref(false);
const delayTime = ref("1");
const editedTodo = ref(null);
const show = ref(true);

const emptyChecked = computed(() => {
  return newTodoTitle.value.length === 0 && checkEmpty.value;
});

const addTodo = async () => {
  if (!newTodoTitle.value) {
    checkEmpty.value = true;
    return;
  }
  let res = await create({
    title: newTodoTitle.value,
    categoryId: selectedCategory.value,
  });
  if (res.errCode == 0) {
    showMessageBox(t("App.messages.createSuccess"), t("App.messages.success"));
    newTodoTitle.value = "";
    store.getTodo();
  } else {
    showMessageBox(t("App.messages.createFailed"), t("App.messages.error"));
  }

  checkEmpty.value = false;
  delayTime.value = "0";
};

const unfinishedTodo = computed(() => {
  return todos.value.filter((todo) => !todo.completed);
});

const editdTodo = (todo) => {
  editedTodo.value = {
    id: todo.id,
    title: todo.title,
  };
};

const completedTodosCount = computed(() => {
  return (
    todos.value.length && todos.value.filter((todo) => todo.completed).length
  );
});

const editDone = (todo) => {
  if (!todo.title) {
    todo.title = editedTodo.value.title;
    return;
  }
  editedTodo.value = null;
};
const cancelEdit = (todo) => {
  todo.title = editedTodo.value.title;
  editedTodo.value = null;
};
const beforeEnter = (dom) => {
  dom.classList.add("drag-enter-active");
};
const enter = (dom, done) => {
  let delay = dom.dataset.delay;
  setTimeout(() => {
    delayTime.value = "1";
    dom.classList.remove("drag-enter-active");
    dom.classList.add("drag-enter-to");
    let transitionend = window.ontransitionend
      ? "transitionend"
      : "webkitTransitionEnd";
    dom.addEventListener(transitionend, function onEnd() {
      dom.removeEventListener(transitionend, onEnd);
      done();
      //调用done() 告诉vue动画已完成，以触发 afterEnter 钩子
    });
  }, delay);
};

const afterEnter = (dom) => {
  dom.classList.remove("drag-enter-to");
};
let dragIndex = null;
const dragenter = (e, index) => {
  e.preventDefault();

  // 避免源对象触发自身的dragenter事件
  if (dragIndex !== index) {
    const source = todos.value[dragIndex];
    todos.value.splice(dragIndex, 1);
    todos.value.splice(index, 0, source);
    // 排序变化后目标对象的索引变成源对象的索引
    dragIndex = index;
  }
};
const dragover = (e) => {
  e.preventDefault();
};
const dragstart = (index) => {
  dragIndex = index;
};
</script>
<style scoped>
.btn-category::after {
  content: "x";
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 50%;

  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
  list-style: none;
  margin-bottom: 10px;
}
.pagination li {
  margin: 0 5px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
}

.pagination li:hover {
  background-color: #f0f0f0;
}

.pagination .active {
  background-color: #f8d2d2;
  color: #333;
}

.pagination .previous,
.pagination .next {
  background-color: #9ce3d0;
  color: #333;
  font-weight: bold;
}

.pagination .previous.disabled,
.pagination .next.disabled {
  background-color: #e0e0e0;
  color: #999;
}
</style>
