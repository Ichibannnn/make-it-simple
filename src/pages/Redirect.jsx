import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { setUserDetails } from "../features/user_management_api/user/userSlice";
import { signIn } from "../features/auth/authSlice";
import { notificationApi } from "../features/api_notification/notificationApi";
import { concernApi } from "../features/api_request/concerns/concernApi";
import { concernReceiverApi } from "../features/api_request/concerns_receiver/concernReceiverApi";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";
import { closingTicketApi } from "../features/api_ticketing/receiver/closingTicketApi";

const Redirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const rawData = query.get("data");

  useEffect(() => {
    try {
      const data = JSON.parse(decodeURIComponent(rawData));

      const { token, ...user } = data.value;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      dispatch(signIn());
      dispatch(setUserDetails(user));

      dispatch(notificationApi.util.resetApiState());
      dispatch(concernApi.util.resetApiState());
      dispatch(concernReceiverApi.util.resetApiState());
      dispatch(concernIssueHandlerApi.util.resetApiState());
      dispatch(ticketApprovalApi.util.resetApiState());
      dispatch(closingTicketApi.util.resetApiState());

      navigate("/");
    } catch (e) {
      console.log("Redirect Error: ", e);
      window.location.href = `https://one.rdfmis.com/`;
    }
  }, [rawData]);
  return;
};

export default Redirect;
