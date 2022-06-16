<template>
  <div>
    <h1>vue3-Worker</h1>
    <button @click="openWorker">开启线程</button>
    <p>F12打开浏览器控制台查看效果</p>
  </div>
</template>

<script setup>
import Worker from 'worker-loader!@/workers/worker'
const openWorker = () => {
  const worker = new Worker()
  worker.postMessage('开启线程')
  worker.onmessage = e => {
    console.log(e.data)
    setTimeout(() => {
      worker.postMessage('线程关闭')
      worker.terminate()
    }, 1000)
  }
}
</script>
