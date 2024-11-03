import React from "react";
import { useDispatch } from "react-redux";
import { notifyError, notifyWarning } from "x25/actions";
import { onErrors } from ".";

const 
  useOnSubmitWithDispatch = () => {
    const dispatch = useDispatch();
  
    return React.useCallback(
      (errors : Immutable.Map<string, any>) => {
        const cb = (node : any) => dispatch(notifyWarning(node));

        return onErrors(cb)(errors);
      },
      [dispatch],
    );
  },
  useOnServerFailed = () => {
    const dispatch = useDispatch();
  
    return (error : string) => {
      dispatch(notifyError(error));
    };
  },
  formUtils = {
    useOnSubmitWithDispatch,
    useOnServerFailed,
  };

export default formUtils;
  