import createStompClient from "./createStompClient"
import { messageForwarder } from "./messageForwarder"

const client = createStompClient()

messageForwarder(client)
