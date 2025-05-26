import { createApp, ref, Teleport, TransitionGroup, h } from 'vue'

// 图标组件 - 使用 render 函数
const SuccessIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', {
    d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
  })
])

const WarningIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', {
    d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
  })
])

const ErrorIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', {
    d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z'
  })
])

const InfoIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', {
    d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
  })
])

// 消息容器组件 - 使用 render 函数
const MessageContainer = {
  setup() {
    const messages = ref([])

    const getIcon = (type) => {
      const iconMap = {
        success: SuccessIcon,
        warning: WarningIcon,
        error: ErrorIcon,
        info: InfoIcon
      }
      return iconMap[type] || InfoIcon
    }

    const addMessage = (message) => {
      messages.value.push(message)
    }

    const removeMessage = (id) => {
      const index = messages.value.findIndex(msg => msg.id === id)
      if (index > -1) {
        messages.value.splice(index, 1)
      }
    }

    return {
      messages,
      getIcon,
      addMessage,
      removeMessage
    }
  },
  // 使用 render 函数替代模板
  render() {
    const { messages, getIcon, removeMessage } = this

    return h(Teleport, { to: 'body' }, [
      h('div', { class: 'message-wrapper' }, [
        h(TransitionGroup, {
          name: 'message',
          tag: 'div'
        }, {
          default: () => messages.map(message => 
            h('div', {
              key: message.id,
              class: ['message', `message--${message.type}`]
            }, [
              // 图标
              h('div', { class: 'message-icon' }, [
                h(getIcon(message.type))
              ]),
              // 内容
              h('div', { class: 'message-content' }, message.content),
              // 关闭按钮
              h('div', {
                class: 'message-close',
                onClick: () => removeMessage(message.id)
              }, '×')
            ])
          )
        })
      ])
    ])
  }
}

class MessageManager {
  constructor() {
    this.messageId = 0
    this.containerInstance = null
    this.app = null
    this.isInitialized = false
    this.addStyles()
  }

  // 添加样式
  addStyles() {
    if (document.getElementById('message-styles')) return

    const style = document.createElement('style')
    style.id = 'message-styles'
    style.textContent = `
      .message-wrapper {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3000;
        pointer-events: none;
      }

      .message {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background-color: white;
        border: 1px solid #ebeef5;
        pointer-events: auto;
        min-width: 300px;
        max-width: 500px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .message--success {
        background-color: #f0f9ff;
        border-color: #c6f6d5;
        color: #22543d;
      }

      .message--warning {
        background-color: #fffbeb;
        border-color: #fed7aa;
        color: #92400e;
      }

      .message--error {
        background-color: #fef2f2;
        border-color: #fca5a5;
        color: #991b1b;
      }

      .message--info {
        background-color: #eff6ff;
        border-color: #93c5fd;
        color: #1e40af;
      }

      .message-icon {
        margin-right: 8px;
        display: flex;
        align-items: center;
      }

      .message--success .message-icon {
        color: #10b981;
      }

      .message--warning .message-icon {
        color: #f59e0b;
      }

      .message--error .message-icon {
        color: #ef4444;
      }

      .message--info .message-icon {
        color: #3b82f6;
      }

      .message-content {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
      }

      .message-close {
        margin-left: 8px;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        color: #909399;
        transition: color 0.3s ease;
      }

      .message-close:hover {
        color: #606266;
      }

      .message-enter-active {
        transition: all 0.3s ease;
      }

      .message-leave-active {
        transition: all 0.3s ease;
      }

      .message-enter-from {
        opacity: 0;
        transform: translateY(-20px);
      }

      .message-leave-to {
        opacity: 0;
        transform: translateY(-20px);
      }

      .message-move {
        transition: transform 0.3s ease;
      }
    `
    document.head.appendChild(style)
  }

  init() {
    if (this.isInitialized) return

    // 创建挂载容器
    const container = document.createElement('div')
    container.id = 'message-container'
    document.body.appendChild(container)

    // 使用 render 函数创建 Vue 应用实例
    this.app = createApp(MessageContainer)
    const instance = this.app.mount(container)
    
    // 保存组件实例引用
    this.containerInstance = instance
    this.isInitialized = true
  }

  showMessage(content, type = 'info', duration = 3000) {
    // 确保初始化
    this.init()

    const id = ++this.messageId
    const message = {
      id,
      content,
      type,
      duration
    }

    // 添加消息到容器
    this.containerInstance.addMessage(message)

    // 自动关闭
    if (duration > 0) {
      setTimeout(() => {
        this.closeMessage(id)
      }, duration)
    }

    return id
  }

  closeMessage(id) {
    if (this.containerInstance) {
      this.containerInstance.removeMessage(id)
    }
  }

  success(content, duration = 3000) {
    return this.showMessage(content, 'success', duration)
  }

  warning(content, duration = 3000) {
    return this.showMessage(content, 'warning', duration)
  }

  error(content, duration = 3000) {
    return this.showMessage(content, 'error', duration)
  }

  info(content, duration = 3000) {
    return this.showMessage(content, 'info', duration)
  }

  // 销毁实例（可选）
  destroy() {
    if (this.app) {
      this.app.unmount()
      const container = document.getElementById('message-container')
      if (container) {
        document.body.removeChild(container)
      }
      this.app = null
      this.containerInstance = null
      this.isInitialized = false
    }
  }
}

// 创建全局实例
const Message = new MessageManager()

export default Message