
import Immutable from "immutable";
import React from "react";
import { language } from "react-immutable-form";

const { getWords } = language;

type Data = Immutable.Map<string, any> | Immutable.List<Immutable.Map<string, any>>;

type NestedListProps = {
//   readonly noBorder?: boolean;
  readonly data: Data;
}

const 
  InnerNestedList = ({ data } : NestedListProps) => {
    const 
      renderListContent = (value : Data | any, key : string | number) => {
        
        if (Immutable.Map.isMap(value) && Immutable.Map.isMap(value.first()))  {
          // If the value is an object or array, render it as a nested list
          return (
            <ul className="m-0 p-0 border-0" key={key}>
              <li className="ps-2 mt-1" key={key}>
                {  
                  <span className="fw-light me-1 fw-medium">{key}</span>
                }
                <ul className="m-0 p-0 border-0" key={key}>
                  {
                    Array.from(value).map(([rowIndex,innerRow]) => (
                      <li className="bg-danger-subtle list-group-item rounded-0 border-danger border-3 border-end-0 border-top-0 border-bottom-0 ps-2" key={`row${key}${rowIndex}`}>

                        <span className="fw-light me-1">
                          {`${getWords().ROW  } `}
                          <span className="badge text-bg-primary rounded-circle">
                            {Number(rowIndex) + 1}
                          </span>
                        </span>
                        <ul className="m-0 p-0 border-0">
                          {
                            Array
                              .from(innerRow as any)
                              .map((([fieldKey, fieldValue] : any, fieldIndex) => (
                                <li 
                                  className="bg-danger-subtle list-group-item rounded-0 border-danger border-3 border-end-0 border-top-0 border-bottom-0 ps-2 py-0" 
                                  key={`row${key}${rowIndex}-row-${fieldIndex}`}>
                                  <ul className="m-0 p-0 border-0" key={key}>
                                    { renderListContent(fieldValue, fieldKey)}
                                  </ul>
                                </li>
                              )))
                          }
                        </ul>
                      </li>
                    ))
                  }
                </ul>
              </li>
            </ul>
          );
        } 

        return (
          <li className="list-group-item rounded-0 border-0 ps-2 bg-danger-subtle" key={key}>
            <span className="fw-light me-1 fw-bold">{key}</span>
            <div className="fw-light ms-1">
              {value}
            </div>
          </li>
        );
      
      };
      
    return (
      <ul className="list-group bg-danger-subtle border-danger  border-3 border-end-0 border-top-0 border-bottom-0 rounded-0">
        {
          Immutable.Map.isMap(data) ? (
            Array.from(data).map(([key, value]) => renderListContent(value, key))
          ) : (
            data.map(([key, value]) => (
              renderListContent(value, key as unknown as "string" | "number")
            ))
          )
        }
      </ul>
    );
  },
  NestedList = React.memo(InnerNestedList),
  performTranslation = (input: Data): any => {
    if (Immutable.List.isList(input)) {
      return input.map((item) => performTranslation(item));
    } else if (Immutable.Map.isMap(input)) {
      return input.reduce((acc, value, currentKey) => {
        const
          mapping = getWords().FIELDS_TO_DESCRIPTIONS,
          translatedKey = mapping[currentKey] || currentKey,
          newTranslation = performTranslation(value);

        return acc.set(translatedKey, newTranslation); 
      }, Immutable.Map<string, any>());
    } 
    return input;
  },
  /**
   * Displays a formatted error message list when there are errors in the form.
   * 
   * This function generates a component containing error messages and invokes a callback with the rendered result.
   * The component displays a message prompting the user to check the errors, followed by a scrollable list of error details.
   * A clickable message is also shown, indicating how to hide the error list.
   *
   * @param {function} cb - A callback function that receives the generated error display component as an argument.
   * @returns {function} A function that accepts an `Immutable.Map<string, any>` of errors and, if errors exist, renders them and passes the result to `cb`.
   */
  rawOnErrors = (cb : (node : any) => any) =>  (errors : Immutable.Map<string, any>) => {
    if (errors.size === 0) {
      return;
    }

    const result = (
      <div
        className="p-1">
        <div className="text-danger">
          {getWords().CHECK_THE_ERRORS}
        </div>
            
        <div className="overflow-scroll" style={{ maxHeight: 200 }}>
          <NestedList data={performTranslation(errors)} />
        </div>
  
        <div className="text-center text-primary mt-2">
          {getWords().TO_HIDE_CLICK_HERE}
        </div>
      </div>
    );

    cb(result);
  };

export default rawOnErrors;