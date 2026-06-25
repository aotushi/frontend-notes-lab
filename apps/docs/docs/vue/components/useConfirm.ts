import { createApp } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

interface ConfirmOptions {
  title?: string
  container?: HTMLElement // 演示用：挂到指定容器，约束在格子内；默认挂 body
}

export function confirm(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  const { title, container = document.body } = options

  return new Promise((resolve) => {
    const host = document.createElement('div')
    container.appendChild(host)

    const app = createApp(ConfirmDialog, {
      message,
      title,
      onResolve(result: boolean) {
        resolve(result)
        app.unmount() // 关闭即销毁，自动清理挂载节点
        host.remove()
      }
    })
    app.mount(host)
  })
}
