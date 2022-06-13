export default function TextareaField({name, value, setValue, errorValue, title, required = false, expand = false}) {
    let feedbackId = name + '_feedback';
    let inputId = name + '_id';

    return (<div className="form-floating">
        <textarea 
            id={inputId}
            className={"form-control " + (expand ? "expand " : "") + (errorValue ? "is-invalid " : "")}
            placeholder={title}
            name={ name }
            value={ value }
            onChange={setValue}
            aria-describedby={feedbackId}
            required={ required }
            style={{height: '100px'}}
        ></textarea>
        <div id={feedbackId} className="invalid-feedback">
            {errorValue}
        </div>
        <label className="text-muted" htmlFor={inputId}>
            {title}
        </label>
    </div>);
}