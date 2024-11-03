

import Immutable from "immutable";
import React from "react";
import DateInput, { DateTemplatePropTypes } from "./DateInput";
import { getTemplateInfo } from "./util-template";

const DateTemplateInner = (props: DateTemplatePropTypes) => {
  const
    { componentProps = Immutable.Map()  } = props,
    theError = props.data.getIn(["meta", "theError"]),
    hasError = typeof theError !== "undefined",
    { leftClass, rightClass, label } = React.useMemo(() => (
      getTemplateInfo(componentProps)
    ), [componentProps]);

  return (
    <div className="row mt-2">
      <label className={leftClass} htmlFor={props.indexFileName}>
        {label}
      </label>
      <div className={rightClass}>
        <DateInput {...props} />
        {!props.hideError && hasError ? (
          <div className="invalid-feedback">
            {theError}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(DateTemplateInner);