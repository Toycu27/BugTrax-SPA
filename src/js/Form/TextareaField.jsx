export default function TextareaField({name, value, setValue, errorValue, title, required = ''}) {
    let feedbackId = name + '_feedback';
    let inputId = name + '_id';

    return (<div className="form-floating">
        <textarea 
            id={inputId}
            className={"form-control " + (errorValue ? "is-invalid" : "")}
            placeholder={title}
            name={ name }
            value={ value }
            onChange={setValue}
            aria-describedby={feedbackId}
            required={ required ? true : false }
            style={{height: '100px'}}
        ></textarea>
        <div id={feedbackId} className="invalid-feedback">
            {errorValue}
        </div>
        <label className="text-muted" htmlFor={inputId}>{title}</label>
    </div>);
}