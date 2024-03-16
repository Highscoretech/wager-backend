const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1770108",
    key: "4c3f9a87fad6b631140b",
    secret: "dcce5cdd52df85a33ee1",
    cluster: "mt1",
    useTLS: true
})

const handlePublicChat = (async(req, res)=>{
    try{
        const { message } = req.body
        pusher.trigger("chat-messages", "messages", 
            { message: message }
        );
        res.status(200).json(message)
    }
    catch(err){
        console.log(err)
    }
})

module.exports = { handlePublicChat }