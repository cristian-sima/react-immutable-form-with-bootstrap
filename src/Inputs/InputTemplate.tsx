

import Immutable from "immutable";
import React from "react";
import SimpleInput, { SimpleInputProps } from "./SimpleInput";
import { getTemplateInfo } from "./util-template";

type InputTemplatePropTypes = SimpleInputProps

const RawInputTemplate = (props: InputTemplatePropTypes) => {
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
        <SimpleInput {...props} />
      </div>
    </div>
  );
};

export default RawInputTemplate;