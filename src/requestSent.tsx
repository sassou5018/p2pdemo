import { Text, useToast } from "@chakra-ui/react";
import useStore from "./Stores/Store";

export default function RequestSent({setReqSent}:{setReqSent: (reqSent: boolean) => void}) {
    const toast = useToast();
    const conn = useStore(state => state.conn);
    conn?.on('data', (data:any) => {
        console.log("data received")
        switch(data.type){
            case "declined":
                useStore.getState().setConnAccepted(false);
                useStore.getState().setReceivingRequest(false);
                useStore.getState().setConn(undefined);
                toast({
                    title: "Request declined",
                    description: "The other user declined your request",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
                setReqSent(false);
                break;
            case "ack":
                useStore.getState().setConnAccepted(true);
                toast({
                    title: "Request accepted",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                setReqSent(false);
                break;
        }
    });
    return(
        <>
        <Text>Request sent...</Text>
        </>
    )
}