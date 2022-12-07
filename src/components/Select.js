export default function Select({
  value,
  name,
  handleChange,
  label,
  errorMessages = [],
  wasValidated = false,
  children
}) {

  function getValidationClassName() {
    if (!wasValidated) return '';
    return errorMessages.length ? 'is-invalid' : 'is-valid';
  }

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">{label}</label>
      <select
        value={value}
        className={'form-select ' + getValidationClassName()}
        id={name}
        name={name}
        onChange={handleChange}
      >
        {children}
      </select>
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