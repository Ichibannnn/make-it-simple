import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { concernIssueHandlerApi, useGetIssueHandlerConcernsQuery } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { notificationApi, useGetNotificationQuery } from "../features/api_notification/notificationApi";
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";
import { useSelector } from "react-redux";
import { useNotification } from "../context/NotificationContext";
import { concernApi } from "../features/api_request/concerns/concernApi";
import { closingTicketApi } from "../features/api_ticketing/receiver/closingTicketApi";
import { concernReceiverApi } from "../features/api_request/concerns_receiver/concernReceiverApi";

const useSignalRConnection = () => {
  const [connection, setConnection] = useState(null);
  const [notification, setNotification] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://pretest-api.mis.rdfmis.com/notification-hub?access_token=${sessionStorage.getItem("token")}`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected");
          connection.on("ReceiveNotification", (data) => {
            setNotification({ data });
          });
        })

        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  useEffect(() => {
    if (notification?.data?.value) {
      dispatch(notificationApi.util.invalidateTags(["Notification"]));

      dispatch(concernApi.util.invalidateTags(["Concern"]));
      dispatch(concernReceiverApi.util.invalidateTags(["Concern Receiver"]));
      dispatch(concernIssueHandlerApi.util.invalidateTags(["Concern Issue Handler"]));

      dispatch(ticketApprovalApi.util.invalidateTags(["Ticket Approval"]));
      dispatch(closingTicketApi.util.invalidateTags(["Closing Ticket"]));
    }
  }, [notification, dispatch]);

  return notification;
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
