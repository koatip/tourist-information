export default function CheckBox({
  label,
  name,
  checked,
  handleChange,
  wasValidated = false,
  errorMessages = [],
}) {

  function getValidationClassName() {
    if (!wasValidated) return '';
    return errorMessages.length ? 'is-invalid' : 'is-valid';
  }

  return (
    <div className="form-check mb-3">
      <input
        checked={checked}
        name={name}
        type="checkbox"
        onChange={handleChange}
        id={name}
        value={name}
        className={'form-check-input ' + getValidationClassName()}
      />
      <label htmlFor={name} className="form-check-label">{label}</label>
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