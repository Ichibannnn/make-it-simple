import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useGetNotificationQuery } from "../features/api_notification/notificationApi";
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";

const useSignalRConnection = () => {
  const [connection, setConnection] = useState(null);
  const dispatch = useDispatch();

  const { data: notification } = useGetNotificationQuery();

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
          console.log("Hub Data: ", notifData);
          console.log("Notification Api: ", notification);

          // if (notification?.value?.forTransferNotif !== notifData?.value?.forTransferNotif) {
          //   dispatch(concernIssueHandlerApi.util.resetApiState());
          //   dispatch(ticketApprovalApi.util.resetApiState());
          // }
        });
        setConnection(newConnection);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    // return () => {
    //   if (newConnection) {
    //     newConnection.stop().then(() => {
    //       console.log("SignalR Connection stopped");
    //     });
    //   }
    // };
  }, [dispatch, notification]);

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
