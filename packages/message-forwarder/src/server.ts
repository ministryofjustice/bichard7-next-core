import createStompClient from "./createStompClient"
import { messageForwarder } from "./messageForwarder"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const stompClient = createStompClient()
const conductorClient = createConductorClient()

messageForwarder(stompClient, conductorClient)
