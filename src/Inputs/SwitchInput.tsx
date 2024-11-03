import Immutable from "immutable";
import React from "react";
import { FieldRendererProps } from "react-immutable-form/types";
import RenderCounter from "../RenderCount";

type SwitchInputProps = FieldRendererProps<HTMLInputElement> & {
  readonly customClass?: any;
};

const 
  SwitchInputInner = (props: SwitchInputProps) => {
    const
      { customClass, idFileName, indexFileName, data = Immutable.Map(), handleBlur, handleChange, handleFocus } = props,
      value = data.get("value"),
      checked = value === true,
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError"),

      onFocus = (event : React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, handleFocus,  idFileName, indexFileName);
        } else {
          handleFocus( idFileName, indexFileName);
        }
      }, 
      onBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, handleBlur,  idFileName, indexFileName);
        } else {
          handleBlur( idFileName, indexFileName);
        }
      },
      onChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const theValue = event.target.checked === true;
        
        if (typeof props.customOnChange === "function") {
          props.customOnChange(event, handleChange,  idFileName, indexFileName);
        } else {
          handleChange( idFileName, theValue, indexFileName);
        }
      },
      hasError = typeof theError !== "undefined",
      theClass = `${hasError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-check-input`,
      wrapperClassName = `form-check ${props.componentProps?.get("checkbox") ? "": "form-switch"}`;

    return (
      <>
        {process.env.NODE_ENV !== "production" && (props.showRenderCounts ? <RenderCounter /> : null)}
        <div className={wrapperClassName}>
          <input
            checked={checked}
            className={theClass}
            disabled={props.disabled}
            id={indexFileName}
            name={indexFileName}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            type="checkbox"
            value={value}
            {...props.elementProps}
          />
          <label className="form-check-label" htmlFor={indexFileName}>
            {props.componentProps?.get("label")}
          </label>
          {
            !props.hideError && hasError ? (
              <span className="text-danger ms-1 small">
                <i className="fa fa-exclamation-triangle me-1" />
                {theError}
              </span>
            ) : null 
          }
        </div>
      </>
    );
  },
  SwitchInput = React.memo(SwitchInputInner);

export default SwitchInput;
