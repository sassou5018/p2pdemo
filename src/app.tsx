import useStore, { PeerStatus } from './Stores/Store';
import Home from './home';
import { useEffect } from 'react';
import peer from './Stores/PeerFIle';
export default function App(){
    const setPeer = useStore(state => state.setPeer);
    const setId = useStore(state => state.setId);
    const setPeerStatus = useStore(state => state.setPeerStatus);
    useEffect(() => {
        setPeerStatus(PeerStatus.Connecting);
        setPeer(peer);
        const id = new Promise<string>((resolve) => {
            peer.on('open', (id) => {
                resolve(id);
            })
        })
        id.then((id) => {
            setId(id);
        }).catch((err) => {
            console.log(err);
            setPeerStatus(PeerStatus.Error);
        })
        setPeerStatus(PeerStatus.Connected);
    },[])
    return(
        <>
        <Home/>
        </>
    )
}