import Immutable from "immutable";
import React from "react";
import { language } from "react-immutable-form";
import { FieldRendererProps } from "react-immutable-form/types";
import RenderCounter from "../RenderCount";

const { getWords } = language;

export type SimpleSelectProps = FieldRendererProps<HTMLSelectElement> & {
  readonly customClass?: any;
};

type ImmutableListOfOptions = {
  readonly list: Immutable.List<Immutable.Map<string, any>>;
  readonly valueKey:string;
  readonly nameKey: string;
  readonly isImmutable?: boolean;
  readonly showEmptyOption?: boolean;
}

const 
  ImmutableListOfOptions = ({ list, valueKey, nameKey } : ImmutableListOfOptions) => (
    <>
      {
        list.map((current: any) => {
          const 
            optionValue = current.get(valueKey),
            optionName = current.get(nameKey) as string ;
          
          return (
            <option 
              key={optionValue}
              value={optionValue}>
              {optionName}
            </option>
          );
        })
      }
    </>
  ),    
  SimpleSelectInner = (props: SimpleSelectProps) => {
    const {
        customClass,
        indexFileName, idFileName,
        data = Immutable.Map(),
        handleBlur,
        handleChange,
        handleFocus,
      } = props,

      componentProps = props.componentProps || Immutable.Map(),
      
      value = props.data.get("value"),
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,

      onFocus = (event: React.FocusEvent<HTMLSelectElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, handleFocus, idFileName, indexFileName);
        } else {
          handleFocus(idFileName, indexFileName);
        }
      },

      onBlur = (event: React.FocusEvent<HTMLSelectElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, handleBlur, idFileName, indexFileName);
        } else {
          handleBlur(idFileName, indexFileName);
        }
      },

      onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (typeof props.customOnChange === "function") {
          props.customOnChange(event, handleChange, idFileName, indexFileName);
        } else {
          const 
            rawValue = event.target.value,
            parsedValue = typeof props.parse === "function" ? props.parse(rawValue) : rawValue; 

          handleChange(idFileName, parsedValue, indexFileName);
        }
      },

      hasError = typeof theError !== "undefined",
      showError = isTouched && hasError,
      theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-select`,

      {
        valueKey = "value",
        nameKey = "name",
        isImmutable = false,
        showEmptyOption = false,
      } = React.useMemo(() => componentProps?.toJS() || {}, [componentProps]),
      list = componentProps.get("list") || Immutable.List();

    return (
      <>
        {process.env.NODE_ENV !== "production" && (props.showRenderCounts ? <RenderCounter /> : null)}
        <select
          {...props.elementProps}
          className={theClass}
          disabled={props.disabled}
          id={indexFileName}
          name={indexFileName}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          value={value}>
          {showEmptyOption ? <option value="">{getWords().PLEASE_SELECT_OPTION}</option> : null}
          {isImmutable ? (
            <ImmutableListOfOptions 
              list={list}
              nameKey={nameKey}
              valueKey={valueKey}  
            />
          ) : (
            list.map(({ [valueKey]: optionValue, [nameKey]: optionName }: any) => (
              <option
                key={optionValue} 
                value={optionValue}>
                {optionName}
              </option>
            ))
          )}
        </select>
        {
          !props.hideError && showError ? (
            <span className="text-danger">{theError}</span>
          ) : null
        }
      </>
    );
  };

export default React.memo(SimpleSelectInner);
