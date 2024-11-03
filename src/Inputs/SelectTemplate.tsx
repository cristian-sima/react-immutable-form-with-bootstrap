

import Immutable from "immutable";
import React from "react";
import SimpleSelect, { SimpleSelectProps } from "./SimpleSelect";
import { getTemplateInfo } from "./util-template";

const SelectTemplateInner = (props: SimpleSelectProps) => {
  const
    { componentProps = Immutable.Map<string, any>()  } = props,
    { leftClass, rightClass, label } = React.useMemo(() => (
      getTemplateInfo(componentProps)
    ), [componentProps]);

  return (
    <div className="row mt-2">
      <label className={leftClass} htmlFor={props.indexFileName}>
        {label}
      </label>
      <div className={rightClass}>
        <SimpleSelect {...props} />
      </div>
    </div>
  );
};

export default React.memo(SelectTemplateInner);