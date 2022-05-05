
export default function SelectField({name, value = "", setValue, errorValue = "", title, options, required = ''}) {
    let feedbackId = name + '_feedback';
    let inputId = name + '_id';
    let optionsHTML = [];
    
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
            onChange={ setValue }
            name={ name }
            value={ value }
            aria-describedby={ feedbackId } 
            required={ required ? true : false }
        >
            <option key="null" value="null"></option>
            { optionsHTML }
        </select>
        { errorValue ?
        <div id={ feedbackId } className="invalid-feedback">
            { errorValue }
        </div>
        : null }
        <label className="text-muted" htmlFor={inputId}>{title}</label>
    </div>);
}