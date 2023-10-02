import { Button, HStack, Input, Text, VStack, useToast } from "@chakra-ui/react";
import useStore from "./Stores/Store";
import { useState } from "react";

export default function Chat() {
    const toast= useToast();
    const conn = useStore(state => state.conn);
    const id = useStore(state => state.id);
    const pushMessage = useStore(state => state.pushMessage);
    const [inputState, setInputState] = useState<string>("");
    const messages = useStore(state => state.messages);
    const handleSend = async(e: any)=>{
        e.preventDefault();
        try{
            await conn?.send({
                type:"message",
                data: {sender: id,
                    message: inputState}
                })
        }catch(err){
            console.log(err);
            return;
        }
        pushMessage({
            sender: id!,
            message: inputState,
            timeStamp: new Date()
        })
        setInputState("");
    }
    conn?.on('data', (data:any) => {
        console.log(data.data)
        if (data.type === "message"){
            console.log(data.data)
            pushMessage(data.data);
        }
        if (data.type === "disconnect"){
            toast({
                title: "Other User Disconnected",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
            conn.close();
            useStore.getState().setConn(undefined);
            useStore.getState().setConnAccepted(false);
            useStore.getState().setReceivingRequest(false);
        }
    });
    return(
        <VStack>
            <Text>Your id is: {id}</Text>
            <VStack h="xl" w="3xl" border="2px" rounded="lg" overflowY="scroll">
                {messages.map((message, i) => {
                    return(
                        <Text key={i}>{message.sender === id ? "You" : "Other guy"}: {message.message}</Text>
                    )
                })}
            </VStack>
            <form onSubmit={handleSend}>
            <HStack>
                <Input placeholder="Message" value={inputState} onChange={(e)=>setInputState(e.target.value)} required/>
                <Button colorScheme="green" type="submit">Send</Button>
            </HStack>
            </form>
            <Button colorScheme="red" onClick={() => {
                conn?.send({
                    type: "disconnect"
                })
                conn?.close();
                useStore.getState().setConn(undefined);
                useStore.getState().setConnAccepted(false);
                useStore.getState().setReceivingRequest(false);
            }}>Disconnect</Button>

        </VStack>
    )
}