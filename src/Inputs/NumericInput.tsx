

import Immutable from "immutable";
import React from "react";
import { HandleBlurFunc, HandleChangeFunc, ID_FieldName, INDEX_FieldName } from "react-immutable-form/types";
import { formatZeroValue } from "x25/utility";
import RenderCounter from "../RenderCount";
import { SimpleInputProps } from "./SimpleInput";
import numericOperations from "./util-numeric";

const   
  { clearFloatOnBlur, floatToEnglishComma, getFloatValueToStore, isFloat } = numericOperations;

type handleNumericBlurFunc = () => any;
type handleNumericChangeFunc = () => any;

export type InputTemplatePropTypes = SimpleInputProps & {
  readonly customOnBlur?: (event : React.FocusEvent<HTMLInputElement, Element>, handleNumericBlur : handleNumericBlurFunc, handleBlur: HandleBlurFunc, idFileName: ID_FieldName, indexFileName : INDEX_FieldName) => any;

  readonly customOnChange?: (event : React.ChangeEvent<HTMLInputElement>, handleNumericChange : handleNumericChangeFunc, handleChange: HandleChangeFunc, idFileName: ID_FieldName, indexFileName : INDEX_FieldName) => any;
}

type formatValueFunc =  (raw: any, optional?: boolean) => string;

const NumericInputInner = (props: InputTemplatePropTypes) => {
  const
    { idFileName, indexFileName, componentProps = Immutable.Map<string, any>(), data = Immutable.Map() } = props,

    customClass = React.useMemo(() => (
      props.componentProps?.get("customClass") || ""
    ), [props.componentProps]),
    
    meta = data.get("meta") || Immutable.Map(),
    inputValue = data.get("value") || "",

    theError = meta.get("theError") as string | undefined,
    isTouched = meta.get("isTouched") as boolean,

    currency = componentProps && componentProps.get("currency") as string | undefined,
    precision = componentProps && componentProps.get("precision") || 2,
    optional = componentProps && componentProps.get("optional") as boolean | undefined,
    formatValue = componentProps && componentProps.get("formatValue") || formatZeroValue as formatValueFunc,
    
    hasError = typeof theError !== "undefined",
    showError = isTouched && hasError,
    theClass = `form-control ${showError ? "is-invalid" : ""} ${customClass ? customClass : ""}`,
    
    [value, setValue] = React.useState(inputValue),

    noCurrency = (typeof currency === "undefined" || Boolean(currency) === false),
    valueToShow = formatValue(value, optional),
    
    updateNumericValue = (targetValue : any) => {        
      setValue(targetValue);

      let valueToStore = targetValue;

      if (isFloat(floatToEnglishComma(targetValue))) {
        valueToStore = getFloatValueToStore(targetValue);
      }

      props.handleChange(idFileName, valueToStore, indexFileName);
    },
    onBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
      const numericHandleOnBlur = () => {
        const
          newValue = clearFloatOnBlur(value, precision),
          hasChanged = value !== newValue;

        if (hasChanged) {
          updateNumericValue(newValue);
        }

        props.handleBlur(idFileName, indexFileName);
      };

      if (typeof props.customOnBlur === "function") {
        props.customOnBlur(event, numericHandleOnBlur, props.handleBlur, idFileName, indexFileName);
      } else {
        numericHandleOnBlur();
      }
    },
    onChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
      if (typeof props.customOnChange === "function") {
        const wrapper = () => {
          updateNumericValue(event.target.value);
        };

        props.customOnChange(event, wrapper, props.handleChange, idFileName, indexFileName);
      } else {
        updateNumericValue(event.target.value);
      }
    },
    onFocus = (event : React.FocusEvent<HTMLInputElement, Element>) => {
      if (typeof props.customOnFocus === "function") {
        props.customOnFocus(event, props.handleFocus, idFileName, indexFileName);
      } else {
        props.handleFocus(idFileName, indexFileName);
      }
    };
    
  React.useEffect(() => {
    const
      hasFloat = isFloat(inputValue),
      wasValidatedWithErrors = !hasFloat && (typeof theError === "string");

    if (hasFloat || wasValidatedWithErrors) {
      updateNumericValue(inputValue);
    }
  }, [data, theError]);


  if (noCurrency) {
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
          value={valueToShow}
          {...props.elementProps}
        />
        {
          !props.hideError && showError ? (
            <span className="text-danger">{theError}</span>
          )  : null 
        }
      </>
    );
  }

  return (
    <>
      <div className="input-group">
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
        <span className="input-group-text">
          {currency}
        </span>
      </div>
      {
        !props.hideError && showError ? (
          <span className="text-danger">{theError}</span>
        )  : null 
      }
    </>
  );
};

export default React.memo(NumericInputInner);