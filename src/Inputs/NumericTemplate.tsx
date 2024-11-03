

import Immutable from "immutable";
import React from "react";
import NumericInput, { InputTemplatePropTypes } from "./NumericInput";
import { getTemplateInfo } from "./util-template";

const NumericTemplateInner = (props: InputTemplatePropTypes) => {
  const
    { componentProps = Immutable.Map()  } = props,
    { leftClass, rightClass, label } = React.useMemo(() => (
      getTemplateInfo(componentProps)
    ), [componentProps]);

  return (
    <div className="row mt-2">
      <label className={leftClass} htmlFor={props.indexFileName}>
        {label}
      </label>
      <div className={rightClass}>
        <NumericInput {...props} />
      </div>
    </div>
  );
};

export default React.memo(NumericTemplateInner);