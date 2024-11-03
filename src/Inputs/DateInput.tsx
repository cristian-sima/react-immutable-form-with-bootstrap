import { ro } from "date-fns/locale";
import Immutable from "immutable";
import React from "react";
import DatePicker from "react-datepicker";
import { FieldRendererProps, HandleChangeFunc } from "react-immutable-form/types";
import { dateToGoFormat, golangDateToMoment } from "x25/utility";
import RenderCounter from "../RenderCount";

export type DateTemplatePropTypes = FieldRendererProps<HTMLInputElement> & {
  readonly customClass?: any;
  readonly customOnChange: (date : Date, handleDateChanged : () => void, handleChange : HandleChangeFunc) => any;
};

const 
  DateInputInner = (props: DateTemplatePropTypes) => {
    const
      { hideError, idFileName, customClass, indexFileName, data = Immutable.Map() } = props,
      value = data.get("value") || "",
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,

      datePickerProps = React.useMemo(() => props.componentProps, [props.componentProps]),
      
      hasError = typeof theError !== "undefined",
      defaultClass = "form-control w-110",
      showError = isTouched && hasError,
      theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : defaultClass}`,

      theValue = React.useMemo(() => {
        const momentObj = golangDateToMoment(value);

        if (momentObj.isValid()) {
          const selectedDate = momentObj.toDate();

          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate;
        }

        return "" as any;
      }, [value]),

      handleFocus = (event : React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, props.handleFocus, idFileName, indexFileName);
        } else {
          props.handleFocus(idFileName, indexFileName);
        }
      }, 
      handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, props.handleBlur, idFileName, indexFileName);
        } else {
          props.handleBlur(idFileName, indexFileName);
        }
      },
      handleChange =  (date: Date) => {
        const dateOnChange = () => {
          props.handleChange(idFileName, dateToGoFormat(date), indexFileName);
        };

        if (typeof props.customOnChange === "function") {
          props.customOnChange(date, dateOnChange, props.handleChange);
        } else {
          dateOnChange();
        }
      };

    return (
      <>
        {process.env.NODE_ENV !== "production" && (props.showRenderCounts ? <RenderCounter /> : null)}
        <DatePicker
          className={theClass}
          dateFormat="dd.MM.yyyy"
          id={indexFileName}
          locale={ro}
          name={indexFileName}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          selected={theValue}
          {...datePickerProps}
        />
        {
          !hideError && showError ? (
            <span className="text-danger">{theError}</span>
          )  : null 
        }
      </>
    );
  };

export default React.memo(DateInputInner);
