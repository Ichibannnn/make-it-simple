import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useEffect } from "react";

const useSignalRConnection = () => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://pretest-api.mis.rdfmis.com/notification-hub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  return connection;
};

export default useSignalRConnection;

// import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
// import { useEffect, useState } from "react";

// // Service to handle SignalR connection
// const useSignalRConnection = (url, events) => {
//   const [connection, setConnection] = useState(null);

//   useEffect(() => {
//     const newConnection = new HubConnectionBuilder()
//       .withUrl(process.env.REACT_APP_SIGNALR_URL_CONNECTION, {
//         skipNegotiation: true,
//         transport: HttpTransportType.WebSockets,
//       })
//       .withAutomaticReconnect()
//       .build();

//     setConnection(newConnection);
//   }, [process.env.REACT_APP_SIGNALR_URL_CONNECTION]);

//   useEffect(() => {
//     if (connection) {
//       connection
//         .start()
//         .then(() => {
//           console.log("Connected!");
//           events.forEach(({ eventName, handler }) => {
//             connection.on(eventName, handler);
//           });
//         })
//         .catch((e) => console.log("Connection failed: ", e));
//     }

//     return () => {
//       if (connection) {
//         connection.stop();
//       }
//     };
//   }, [connection]);

//   return connection;
// };

// export default useSignalRConnection;
