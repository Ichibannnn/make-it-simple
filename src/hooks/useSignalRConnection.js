import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const useSignalRConnection = () => {
  const [connection, setConnection] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://pretest-api.mis.rdfmis.com/notification-hub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        newConnection.on("TicketNotifData", (notifData) => {
          // dispatch(concernIssueHandlerApi.util.invalidateTags(["Concern Issue Handler"]));
        });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop().then(() => {
          console.log("SignalR Connection stopped");
        });
      }
    };
  }, [dispatch]);

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
