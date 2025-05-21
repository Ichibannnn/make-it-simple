import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { notificationApi } from "../features/api_notification/notificationApi";
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";

import { concernApi } from "../features/api_request/concerns/concernApi";
import { closingTicketApi } from "../features/api_ticketing/receiver/closingTicketApi";
import { concernReceiverApi } from "../features/api_request/concerns_receiver/concernReceiverApi";
import { notificationMessageApi } from "../features/api_notification_message/notificationMessageApi";

import ring2 from "../../src/assets/ringtone/ring2.wav";
import { setOpenTickets } from "../features/global/webTicketSlice";

const useSignalRConnection = () => {
  const [connection, setConnection] = useState(null);
  const [notification, setNotification] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(
          // `https://10.10.10.14:5001/notification-hub?access_token=${sessionStorage.getItem("token")}`,
          `https://pretest-api.mis.rdfmis.com/notification-hub?access_token=${sessionStorage.getItem("token")}`,
          {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          }
        )
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    }
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("TransactionData", (data) => {
            setNotification({ data });
          });
          connection.on("OpenTickets", (data) => {
            dispatch(setOpenTickets(data));
          });
        })

        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  useEffect(() => {
    if (notification?.data?.value) {
      // const ring = new Audio(ring2);
      // ring.play().catch((error) => console.error("Audio playback failed: ", error));

      console.log("notification: ", notification.data.value);

      dispatch(notificationApi.util.invalidateTags(["Notification"]));
      dispatch(notificationMessageApi.util.invalidateTags(["Notification Message"]));

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
