import { Box, Button, Center, Heading, Input, Text, VStack } from "@chakra-ui/react";
import useStore, { PeerStatus } from "./Stores/Store";
import { useState } from "react";
import Chat from "./chat";
import RequestSent from "./requestSent";

export default function Home(){
  const [reqSent, setReqSent] = useState<boolean>(false);
  const peerStatus = useStore(state => state.peerStatus);
  const id = useStore(state => state.id);
  const peer = useStore(state => state.peer);
  const setConn = useStore(state => state.setConn);
  const setReceivingRequest = useStore(state => state.setReceivingRequest);
  const setConnAccepted = useStore(state => state.setConnAccepted);
  const receivingRequest = useStore(state => state.receivingRequest);
  const conn = useStore(state => state.conn);
  const connAccepted = useStore(state => state.connAccepted);
  peer?.on('connection', (conn) => {
    setReceivingRequest(true);
    setConn(conn);
  })

  const handleConncet = () => {
    const conn = peer?.connect(inputState);
    setConn(conn);
    setReqSent(true);
  }

  const handleConnAccepted = () => {
    conn?.send({
      type: "ack"
    })
    setConnAccepted(true);
  }

  const handleConnDeclined = async() => {
    await conn?.send({
      type: "declined"
    })
    console.log("You declined req")
    setConnAccepted(false);
    setReceivingRequest(false);
    conn?.close();
    setConn(undefined);
  }

  const [inputState, setInputState] = useState<string>("");
  return(
    <Center>
      {!connAccepted &&
      <VStack>
        <Heading>Peer 2 Peer Messaging Demo</Heading>
        <Text>{peerStatus === PeerStatus.Connected && id !== undefined ? `Your id is: ${id}` : "Loading..."}</Text>
        <Text>{receivingRequest && conn !== undefined ? `Request Received from id: ${conn.peer}` : "Waiting for connection..."}</Text>
        {receivingRequest && <Button colorScheme="green" onClick={() => handleConnAccepted()}>Accept</Button>}
        {receivingRequest && <Button colorScheme="red" onClick={() => handleConnDeclined()}>Decline</Button>}
        {peerStatus === PeerStatus.Error && <Box color="red">Error connecting to peer server</Box>}
        <Input placeholder="Connect to: id" value={inputState} onChange={(e)=>setInputState(e.target.value)} disabled={receivingRequest}/>
        <Button colorScheme="green" onClick={handleConncet} disabled={receivingRequest}>Connect</Button>
        {reqSent && <RequestSent setReqSent={setReqSent}/>}
      </VStack>}
      {connAccepted && conn !== undefined &&
      <Chat/>
      }
    </Center>
  )
}