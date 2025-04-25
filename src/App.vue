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
              placeholder="新增待办事项..."
              v-model="newTodoTitle"
              @keyup.enter="addTodo"
              :class="{ empty: emptyChecked }"
            />
            <transition name="tips">
              <div class="tips" v-if="emptyChecked" style="color: red">
                💡请输入内容！
              </div>
            </transition>
            <button class="btn submit-btn" type="button" @click="addTodo">
              提交
            </button>
          </div>
        </div>
      </div>
      <div class="container main">
        <div class="todo-list-box">
          <div class="bar-message" style="background-color: var(--bg-normal)">
            <input
              type="button"
              class="btn btn-label btn-allFinish action"
              value="分类"
              @click="markAllAsCompleted"
            />
            <input
              type="button"
              class="btn btn-label btn-allFinish"
              value="分类2"
              @click="markAllAsCompleted"
            />
          </div>

          <ul v-if="!todos.length" class="empty-tips">
            <li>添加你的第一个待办事项！📝</li>
            <li>食用方法💡：</li>
            <li>✔️ 所有提交操作支持Enter回车键提交</li>
            <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)</li>
            <li>✔️ 双击上面的标语和 Todo 可进行编辑</li>
            <li>✔️ 右侧的小窗口是快捷操作哦</li>
            <li>🔒 所有的Todo数据存储在浏览器本地</li>
            <li>📝 支持下载和导入，导入追加到当前序列</li>
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
              :key="todo.id"
              class="todo-item"
              @dragenter="dragenter($event, index)"
              @dragover="dragover($event, index)"
              @dragstart="dragstart(index)"
              :data-delay="index * 150 * delayTime"
              v-show="show"
              :draggable="!(editedTodo !== null && editedTodo.id === todo.id)"
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
              <div class="todo-btn btn-delete" @click="removeTodo(todo)">
                <img src="./assets/img/del.svg" alt="删除" draggable="false" />
              </div>
              <!-- 编辑 -->
              <div
                class="edit-todo-wrapper"
                v-if="editedTodo !== null && editedTodo.id === todo.id"
              >
                <input
                  type="text"
                  class="edit-todo"
                  value="编辑 Todo..."
                  v-if="editedTodo !== null && editedTodo.id === todo.id"
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
          <div class="bar-message bar-bottom">
            <div class="bar-message-text">
              <span v-if="unfinishedTodo.length > 0"
                >剩余 {{ unfinishedTodo.length }} 项未完成</span
              >
              <span v-else-if="completedTodosCount">完美收工！</span>
            </div>
          </div>
        </div>

        <ActionMenu />
      </div>

      <!-- 自定义个人的信息 -->
      <div class="nav" draggable="false">
        <div class="github">
          <a
            href="https://github.com/ricocc/uiineed-todo-list?ref=opensource-todo"
            target="_blank"
            class="social-link"
            draggable="false"
          >
            <img
              src="./assets/img/github.svg"
              class="ic-social"
              alt=""
              draggable="false"
            />
          </a>
        </div>

        <!-- 根据需要切换中英文作为首页 -->
        <div class="language switch-language">
          <a
            href="index.html"
            class="en"
            draggable="false"
            @click="saveLanguage('en')"
            >En</a
          >
          <span>/</span>
          <a
            href="javascript:;"
            target="_self"
            class="zh active"
            draggable="false"
            >中</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ActionMenu from "./components/ActionMenu.vue";
import { ref, computed } from "vue";
const todos = ref([]);
const newTodoTitle = ref("");
const checkEmpty = ref(false);
const delayTime = ref("1");
const editedTodo = ref(null);
const show = ref(true);

const emptyChecked = computed(() => {
  return newTodoTitle.value.length === 0 && checkEmpty.value;
});

// 添加todo
const addTodo = () => {
  if (!newTodoTitle.value) {
    checkEmpty.value = true;
    return;
  }
  todos.value.unshift({
    id: todos.value.length + 1,
    title: newTodoTitle.value,
    completed: false,
  });
  newTodoTitle.value = "";
  checkEmpty.value = false;
  delayTime.value = "0";
};
// 未完成的所有项
const unfinishedTodo = computed(() => {
  return todos.value.filter((todo) => !todo.completed);
});

//双击编辑
const editdTodo = (todo) => {
  editedTodo.value = {
    id: todo.id,
    title: todo.title,
  };
};
// 编辑回车确认
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

<style></style>
