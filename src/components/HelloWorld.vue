<template>
     <div>
        <header>当前总线上消息</header>
        <content>
            <textarea id="textAll" v-model="form.times" style="width:100%;height:30px;"></textarea>
        </content>
    </div>
  <div>
    <h1>客户端</h1>
    <form>
        <p>发送: </p>
        <textarea style="width:100%;height:100px;" v-model="form.message" ></textarea>
        <p>接收: </p>
        <textarea style="width:100%;height:300px;" v-model="form.receive" ></textarea>
    </form>
    <button @click="send">给服务器发送消息</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import Worker from 'worker-loader!@/workers/worker'
var object = new Object();
object.msg_id = "ping"
object.data = "ping"

var userInfo = new Object();
userInfo.user = "tom"
userInfo.password = "toor"

var Message = new Object();
Message.msg_id = "hello"
Message.data =JSON.stringify(userInfo)
//const times = ref("")
const form = reactive({
    times:'',
    message:'hello world',
    receive:''


})
        //console.log(object)
//var res = JSON.stringify(object)
const worker = new Worker()



worker.onmessage =  (event) =>{
            var data = event.data;
            //console.log(data)
            
            //if (!!data.msg_id) {
                switch (data.msg_id) {
                    case "close":
                        worker.terminate();
                        break;
                    case "ping":
                        setTimeout(function(){
                            worker.postMessage({code: "sendmsg",data: object});
                        },10000)
                        break;
                    case "hello":
                    form.times = JSON.parse(JSON.stringify(data.data))+ "\r\n";
                        break;
                        
                    case "echo":
                       //var str = data.data.split(",");
                       //console.log(data.data)
                        form.receive+=JSON.parse(data.data)+"\t";
                        break;
                    default:
                        
                }
          //  }
        };


worker.postMessage({code: "sendmsg",data: Message});

const send = () => {
  let msg = form.message
  var Message2 = new Object();
  Message2.msg_id = "echo"
  Message2.data =JSON.stringify(msg)
  worker.postMessage({code: "sendmsg",data: Message2});

}

</script>
