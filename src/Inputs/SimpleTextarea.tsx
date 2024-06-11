import Immutable from "immutable";
import React from "react";
import { FieldRendererProps } from "react-immutable-form/types";

export type SimpleTextareaProps = FieldRendererProps<HTMLTextAreaElement> & {
  readonly customClass?: any;
};

const 
  SimpleTextareaInner = (props: SimpleTextareaProps) => {
    const
      { customClass, idFileName, indexFileName, data = Immutable.Map(), handleBlur, handleChange, handleFocus } = props,
      renderCount = React.useRef(0),
      value = data.get("value") || "",
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,
      onFocus = (event : React.FocusEvent<HTMLTextAreaElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, handleFocus, idFileName, indexFileName);
        } else {
          handleFocus(idFileName, indexFileName);
        }
      }, 
      onBlur = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, handleBlur, idFileName, indexFileName);
        } else {
          handleBlur(idFileName, indexFileName);
        }
      },
      onChange = (event: React.ChangeEvent<HTMLTextAreaElement> ) => {
        if (typeof props.customOnChange === "function") {
          props.customOnChange(event, handleChange, idFileName, indexFileName);
        } else {
          handleChange(idFileName, event.target.value, indexFileName);
        }
      },
      hasError = typeof theError !== "undefined",
      showError = isTouched && hasError,
      theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-control`;

    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <>
        <span className="badge text-bg-primary">{renderCount.current}</span>
        <textarea
          className={theClass}
          disabled={props.disabled}
          id={indexFileName}
          name={indexFileName}
          onBlur={onBlur as any}
          onChange={onChange as any}
          onFocus={onFocus as any}
          value={value}
          {...props.elementProps}
        />
        {
          !props.hideError && showError ? (
            <span className="text-danger">{theError}</span>
          )  : null 
        }
      </>
    );
  };

export const RawSimpleTextarea = React.memo(SimpleTextareaInner);