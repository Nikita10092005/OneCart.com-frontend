import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ViewerCount = ({ productId }) => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let socket;

    try {
      socket = io(SOCKET_URL, {
        transports: ["polling", "websocket"], // polling first — more reliable
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        timeout: 5000,
      });

      socket.on("connect", () => {
        socket.emit("joinProductRoom", { productId });
      });

      socket.on("connect_error", () => {
        setError(true);
      });

      socket.on("viewerCount", ({ productId: pid, count: c }) => {
        if (pid === productId) setCount(c);
      });
    } catch (err) {
      setError(true);
    }

    return () => {
      if (socket) {
        try {
          socket.emit("leaveProductRoom", { productId });
          socket.disconnect();
        } catch (_) {}
      }
    };
  }, [productId]);

  if (error || count < 2) return null;

  return (
    <p className="text-sm text-orange-500 font-medium">
      {count} people are viewing this
    </p>
  );
};

export default ViewerCount;
