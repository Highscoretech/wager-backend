const Ably = require('ably/promises');
const handlePublicChat = (async(req, res)=>{
  let ably = new Ably.Realtime.Promise("dUjS3Q.PoS8yw:LtcMZYuAmg9VdrrzL_rAj_TmnKzWHitnvVqe4YBKKWg")
  ably.connection.once("connected", () => {
    console.log("Connected to Ably!")
  })
  return ably
})


async function publishSubscribe() {
    // Connect to Ably with your API key
  let ably = await handlePublicChat() 
    const chat_message = []
    const handleChatMessages = (async(newMessage)=>{
        chat_message.push(newMessage)
        const channel = ably.channels.get("return-message")
         await channel.publish("chat-message", chat_message)
    });
  
    // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
    const channel = ably.channels.get("quickstart")
    await channel.subscribe("first", (message) => {
        handleChatMessages(message.data)
    });
}
publishSubscribe()

module.exports = { handlePublicChat }