export default function CheckboxField({name, value, setValue, errorValue, title, required = ''}) {
    let feedbackId = name + '_feedback';
    let inputId = name + '_id';

    return (<>
        <div className="form-check">
            <input 
                id={inputId}
                className={"form-check-input " + (errorValue ? "is-invalid" : "")}
                type="checkbox" 
                value={value}
                onChange={setValue}
                aria-describedby={feedbackId}
                required={ required ? true : false }
            />
            <label className="form-check-label" htmlFor={inputId}>
                { title }
            </label>
            <div id={feedbackId} className="invalid-feedback">
                {errorValue}
            </div>
        </div>
    </>);
}