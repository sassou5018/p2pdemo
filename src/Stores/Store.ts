import Peer, { DataConnection } from 'peerjs'
import {create} from 'zustand'

export enum PeerStatus {
    Idle,
    Connecting,
    Connected,
    Error
}

export interface Message{
    sender: string;
    message: string;
    timeStamp: Date;
}


export interface Store {
    peer: undefined | Peer;
    id: undefined | string;
    conn: undefined | DataConnection;
    peerStatus: PeerStatus;
    receivingRequest: boolean;
    connAccepted: boolean;
    messages: Message[];
    setPeer: (peer: Peer) => void;
    setId: (id: string) => void;
    setConn: (conn: DataConnection | undefined) => void;
    setPeerStatus: (status: PeerStatus) => void;
    setReceivingRequest: (status: boolean) => void;
    setConnAccepted: (status: boolean) => void;
    pushMessage: (message: Message) => void;
}

const useStore = create<Store>((set)=>({
    peer: undefined,
    id: undefined,
    conn: undefined,
    peerStatus: PeerStatus.Idle,
    receivingRequest: false,
    connAccepted: false,
    messages: [],
    setPeer: (peer: Peer) => set({peer}),
    setId: (id: string) => set({id}),
    setConn: (conn: DataConnection | undefined) => set({conn}),
    setPeerStatus: (peerStatus: PeerStatus) => set({peerStatus}),
    setReceivingRequest: (receivingRequest: boolean) =>set({receivingRequest}),
    setConnAccepted: (connAccepted: boolean) => set({connAccepted}),
    pushMessage: (message: Message) => set((state)=>{
        let exists = false;
        state.messages.forEach((msg)=>{
            if(msg == message){
                exists = true;
            }
        })
        if(exists){
            return state;
        }
        return {messages: [...state.messages, message]}
    })
}))

export default useStore;