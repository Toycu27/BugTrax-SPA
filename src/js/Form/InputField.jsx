export default function InputField({name, value = "", setValue, errorValue = "", title, options, type = 'text', required = ''}) {
    let feedbackId = name + '_feedback';
    let inputId = name + '_id';

    return (<div className="form-floating">
        <input 
            id={inputId}
            className={"form-control " + (errorValue ? "is-invalid" : "")}
            name={ name }
            type={type} 
            placeholder={title} 
            value={value}
            onChange={setValue}
            aria-describedby={feedbackId}
            required={ required ? true : false }
        />
        <div id={feedbackId} className="invalid-feedback">
            {errorValue}
        </div>
        <label className="text-muted" htmlFor={inputId}>{title}</label>
    </div>);
}