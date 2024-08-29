import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { notificationApi, useGetNotificationQuery } from "../features/api_notification/notificationApi";
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";

const useSignalRConnection = () => {
  const [connection, setConnection] = useState(null);
  const dispatch = useDispatch();

  const { data: notification } = useGetNotificationQuery();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://pretest-api.mis.rdfmis.com/notification-hub?access_token=${localStorage.getItem("token")}`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("SignalR Connected");

        newConnection.on("ReceiveNotification", (hubNotification) => {
          // console.log("Hub Data: ", hubNotification);
          // console.log("Notification Api: ", notification);
          // dispatch(notificationApi.util.resetApiState());
          // if (dispatch(notificationApi.util.resetApiState())) {
          //   dispatch(concernIssueHandlerApi.util.invalidateTags(["Concern Issue Handler"]));
          // }
        });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    return () => {
      if (newConnection) {
        newConnection.stop().then(() => {
          console.log("SignalR Stopped");
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
