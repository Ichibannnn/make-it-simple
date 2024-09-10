import React from "react";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { notificationApi } from "../features/api_notification/notificationApi";
import { useDispatch } from "react-redux";

const notificationMiddleware = (store) => (next) => (action) => {
  console.log("Action Type: ", action.type); // Debugging: Log the action type

  // console.log("Notification Type: ", notificationApi.util.resetApiState.type);

  if (action.type === notificationApi.util.resetApiState.type) {
    console.log("Reset API State Detected"); // Debugging: Confirm the action is detected

    // Invalidate the concern issue handler tags
    // store.dispatch(concernIssueHandlerApi.util.resetApiState());
  }

  return next(action);
};

export default notificationMiddleware;
