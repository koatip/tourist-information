export default function Textarea(
  {
    name,
    handleChange,
    label,
    errorMessages = [],
    wasValidated = false,
    value = '', 
    rows = 4
  }
) {
  function getValidationClassName() {
    if (!wasValidated) return '';
    return errorMessages.length ? 'is-invalid' : 'is-valid';
  }

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">{label}</label>
      <textarea rows={rows}
        name={name}
        onChange={handleChange}
        id={name}
        value={value}
        className={'form-control ' + getValidationClassName()}
      />
      <div className="invalid-feedback">
        {errorMessages.length === 1 ?
          <>{errorMessages[0]}</>
          :
          <ul>
            {errorMessages.map((errorMessage) => <li key={errorMessage}>{errorMessage}</li>)}
          </ul>
        }
      </div>
    </div>
  )
}