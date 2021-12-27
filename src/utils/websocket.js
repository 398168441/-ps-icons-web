/**
 * 创建websocket帮助类，支持消息订阅方式获取推送数据，支持断开重连，自动发送ping包
 * path: websocket接口地址
 * pingInterval: ping包间隔
 * reconnectInterval： 重连间隔
 * reconectLimit： 重连最大时间
 *
 * 服务端需配合实现：
 * 1. 推送消息都以形式json发送,必须包含messageType: 消息类型， message: 消息内容，如{messageType: 'typeA', message: 'xxx'}
 * 2. 服务端收到messageTypes, 根据消息类型推送对应消息到客户端，(若后端是全部类型推送，前端去掉updateMessages相关即可)
 */
class Ws {
	constructor({path, pingInterval, reconnectInterval, reconectLimit}) {
		this.path = path
		this.pingInterval = pingInterval
		this.reconnectInterval = reconnectInterval
		this.reconectLimit = reconectLimit
		this.messages = {}
		this.token = null
		this.retryCount = 0
		this.websocket = null
		this.status = null
		this.reconnectTimer = null
		this.pingTimer = null
	}

	connect(token) {
		this.token = token
		this.websocket = new WebSocket(this.path)
		this.websocket.onopen = (() => {
			this.reset()
			this.heartCheck()
			this.updateMessages()
		})
		this.websocket.onmessage = (({data}) => {
			console.log('ws onmessage: ', data)
			const {messageType, message} = JSON.parse(data) || {}
			if(messageType) {
				this.publish(messageType, message)
			}
		})
		this.websocket.onerror = ((e) => {
			console.log('ws onmessage: ', e)
			if(!this.reconnectTimer) {
				this.status = 'ERROR'
				this.reconnect()
			}
		})
		this.websocket.onclose = ((e) => {
			console.log('ws onclose: ', e)
			if(!this.reconnectTimer && this.status !== 'ERROR' && this.status !== 'CLOSE_SELF') {
				this.status = 'CLOSE'
				this.reconnect()
			}
		})
	}

    reconnect = () => {
    	this.reconnectTimer = setInterval(() => {
    		if(this.reconectLimit <= 0) {
    			this.close()
    			this.reset()
    			console.error(new Error(`无法连接到${this.path}`))
    		}else{
    			this.reconectLimit -= this.reconnectInterval
    			this.connect(this.token)
    		}
    	}, this.reconnectInterval)
    }

    close = () => {
    	// 标识为主动关闭
    	this.status = 'CLOSE_SELF'
    	this.websocket.close()
    }

    send = data => {
    	if(this.websocket.readyState === 1){
    		this.websocket.send(typeof data === 'object' ? JSON.stringify(data) : data)
    	}
    }

    reset() {
    	if(this.reconnectTimer) {
    		clearInterval(this.reconnectTimer)
    	}
    	if(this.pingTimer) {
    		clearInterval(this.pingTimer)
    	}
    	this.reconnectTimer = null
    	this.pingTimer = null
    	this.status = null
    	this.reconectLimit = 300000
    }

    heartCheck() {
    	this.pingTimer = setInterval(() => {
    		this.send('PING')
    	}, this.pingInterval)
    }

    updateMessages() {
    	const messageTypes = Object.keys(this.messages).filter(key => this.messages[key] && this.messages[key].length > 0)
    	console.log('messageTypes', messageTypes)
    	if(messageTypes.length > 0) {
    		const data = JSON.stringify({ messageTypes, token: this.token })
    		this.send({data})
    	}
    }

    subscribe(message, func) {
    	if(typeof func !== 'function'){
    		return false
    	}

    	if(!this.messages[message]){
    		this.messages[message] = []
    		this.messages[message].push(func)
    		this.updateMessages()
    	}else{
    		this.messages[message].push(func)
    	}
    	return true
    }

    unsubscribe(message, func) {
    	if(this.messages[message]){
    		this.messages[message] = this.messages[message].filter(item => item !== func)
    		if(this.messages[message].length === 0) {
    			this.updateMessages()
    		}
    		return true
    	}
    	return false
    }

    publish(message, data) {
    	if(this.messages[message] && this.messages[message].length > 0){
    		this.messages[message].forEach(func => func(data))
    	}
    }
}

// 单例化
// 默认配置
export default new Ws({
	path: 'ws://localhost:3001/ws/test',
	pingInterval: 60 * 1000, // 心跳间隔时间60s
	reconnectInterval: 10 * 1000, // 重连时间间隔 10s
	reconectLimit: 5 * 60 * 1000, // 重连五分钟 超过五分钟关闭
})
