import Immutable from "immutable";
import React from "react";
import { FieldRendererProps } from "react-immutable-form/types";
import RenderCounter from "../RenderCount";

export type SimpleInputProps = FieldRendererProps<HTMLInputElement> & {
  readonly theType?: "input" | "password";
};

const SimpleInputInner = (props: SimpleInputProps) => {
  const {
      indexFileName,
      idFileName,
      data = Immutable.Map(),
      handleBlur,
      handleChange,
      handleFocus,
    } = props,
    value = data.get("value") || "",
    meta = data.get("meta") || Immutable.Map(),
    theError = meta.get("theError") as string | undefined,
    isTouched = meta.get("isTouched") as boolean,

    customClass = React.useMemo(() => (
      props.componentProps?.get("customClass") || ""
    ), [props.componentProps]),
  
    onFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
      if (typeof props.customOnFocus === "function") {
        props.customOnFocus(event, handleFocus, idFileName, indexFileName);
      } else {
        handleFocus(idFileName, indexFileName);
      }
    },
  
    onBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
      if (typeof props.customOnBlur === "function") {
        props.customOnBlur(event, handleBlur, idFileName, indexFileName);
      } else {
        handleBlur(idFileName, indexFileName);
      }
    },
  
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // if (typeof props.customOnChange === "function") {
      //   props.customOnChange(event, handleChange, idFileName, indexFileName);
      // } else {
      //   handleChange(idFileName, event.target.value, indexFileName);
      // }
      if (typeof props.customOnChange === "function") {
        props.customOnChange(event, handleChange, idFileName, indexFileName);
      } else {
        const 
          hasParser = typeof props.parse === "function",
          rawValue = event.target.value,
          parsedValue = hasParser ? props.parse(rawValue) : rawValue;

        handleChange(idFileName, parsedValue, indexFileName);
      }
    },
  
    hasError = typeof theError !== "undefined",
    showError = isTouched && hasError,
    theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-control`;

  return (
    <>
      {process.env.NODE_ENV !== "production" && (props.showRenderCounts ? <RenderCounter /> : null)}
      <input
        className={theClass}
        disabled={props.disabled}
        id={indexFileName}
        name={indexFileName}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        type={props.theType}
        value={value}
        {...props.elementProps}
      />
      {!props.hideError && showError ? <span className="text-danger">{theError}</span> : null}
    </>
  );
};

export default React.memo(SimpleInputInner);
