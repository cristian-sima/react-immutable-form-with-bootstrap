

import Immutable from "immutable";
import React from "react";
import SimpleTextarea, { SimpleTextareaProps } from "./SimpleTextarea";
import { getTemplateInfo } from "./util-template";

const TextareaTemplateInner = (props: SimpleTextareaProps) => {
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
        <SimpleTextarea {...props} />
      </div>
    </div>
  );
};

export default  React.memo(TextareaTemplateInner);