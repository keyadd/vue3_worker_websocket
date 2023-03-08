
var wsMethod = (function () {
    var socket = null;

    function connect(wsurl) {
            socket = new WebSocket(wsurl);
    
    }
    function onOpen() {
        postMessage({ code: "openConnect" });
    }
    function onClose() {
        postMessage({ msg_id: "close" });
    }
    function onMessaage(event) {
        postMessage(JSON.parse(event.data));
    }
    function onError(event) {
        socket = null;
        if (event.target.readyState == 3) {
            //断线重连
            setTimeout(function () {
                connect(event.target.url);
                initMessageEvent();
            }, 1000);
        }
    }

    
    // function sendMessage(msg) {
    //     if (socket == null) return;
        
    
        
    // }
    const sendMessage = (msg) => {
       
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(msg);
            return
        } else if (socket.readyState == WebSocket.CONNECTING) {
            //console.log(msg)
            
          // Queue a retry
          socket.addEventListener('open', () => sendMessage(msg))
        }
      };


    function initMessageEvent() {
        socket.onopen = onOpen;
        socket.onclose = onClose;
        socket.onmessage = onMessaage;
        socket.onerror = onError;
    }
    return {
        initWsConnect: function (url) {
            connect(url);
            initMessageEvent();
        },
        sendMessage: sendMessage
    }
})();
var url = "ws://localhost:8881/api/v1/ws";
wsMethod.initWsConnect(url);

var object = new Object();
object.msg_id = "ping"
object.data = "ping"
wsMethod.sendMessage(JSON.stringify(object));
onmessage = function (event) {
    if (event.data.code) {
        var code = event.data.code.toLowerCase();
       // console.log(event.data.data)
        switch (code) {
            case "init":
                break;
            case "sendmsg":
                //console.log(JSON.stringify(event.data.data))
                wsMethod.sendMessage(JSON.stringify(event.data.data));
                break;
            default:
                break;
        }
    }
}


// addEventListener('message', e => {
//     const { data } = e
//     console.log(data)
//     setTimeout(() => {
//         return postMessage('线程完成')
//     }, 1000)
// })
export default {}
