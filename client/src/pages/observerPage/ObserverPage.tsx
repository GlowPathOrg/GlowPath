import { useParams, useSearchParams } from 'react-router-dom';
import MapComponent from '../../components/MapComponent/MapComponent';
import { useSocket } from '../../hooks/useSocket';
import { useEffect, useState } from 'react';
import { ShareI } from '../../services/shareService';

const ObserverPage = () => {
  const [share, setShare] = useState<ShareI | null>();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const password = searchParams.get("password") || "";
  const { position, connectSocket, joinShare } = useSocket({password});

  useEffect(() => {
    if (id) {
      connectSocket();
      console.log("Connected to socket");
      joinShare(id);
      console.log("Joined share " + id);
    }
  }, []);

return (
  <>
    <h1>{JSON.stringify(position)}</h1>
  </>
);

}

export default ObserverPage;