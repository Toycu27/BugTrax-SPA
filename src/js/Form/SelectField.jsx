
export default function SelectField({name, value, setValue, errorValue, title, options, required = false, disabled = false}) {
    let feedbackId = name + '_feedback';
    let inputId = name + '_id';
    let optionsHTML = [];
    if (value === null) value = '';
    
    if (Array.isArray(options)) {
        options.map(item => 
            optionsHTML.push(<option key={item.id || item} value={item.id || item}>{ item.title || item.name || item }</option>)
        );
    } else {
        for (let key in options) {
            optionsHTML.push(<option key={ key } value={ key }>{ options[key] }</option>)
        }
    }

    return (<div className="form-floating">
        <select 
            id={inputId}
            className={ "form-select " + (errorValue ? "is-invalid" : "") } 
            name={ name }
            value={ value }
            onChange={ setValue }
            aria-describedby={ feedbackId } 
            required={ required }
            disabled={ disabled }
        >
            <option key="null" value="null"></option>
            { optionsHTML }
        </select>
        { errorValue &&
            <div id={ feedbackId } className="invalid-feedback">
                { errorValue }
            </div>
        }
        <label className="text-muted" htmlFor={inputId}>
            {title}
        </label>
    </div>);
}