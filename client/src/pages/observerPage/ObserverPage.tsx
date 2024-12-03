import { useParams, useSearchParams } from 'react-router-dom';
//import MapComponent from '../../components/MapComponent/MapComponent';
import { useSocket } from '../../hooks/useSocket';
import { useEffect } from 'react';
//import { ShareI } from '../../services/shareService';

const ObserverPage = () => {
  //const [share, setShare] = useState<ShareI | null>();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const password = searchParams.get("password") || "";
  const { isConnected, position, connectSocket, joinShare } = useSocket({password});

  useEffect(() => {
    if (id) {
      console.log("Trying to connect to socket");
      connectSocket();
    }
  }, []);

  useEffect(() => {
    if (id && isConnected) {
      console.log("Trying to join share " + id);
      joinShare(id);
    }
  },[id, isConnected]);

return (
  <>
    <h1>{JSON.stringify(position)}</h1>
  </>
);

}

export default ObserverPage;