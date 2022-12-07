export default function Input(
  {
    name,
    handleChange,
    type = 'text',
    label,
    errorMessages = [],
    wasValidated = false,
    value = ''
  }
) {
  function getValidationClassName() {
    if (!wasValidated) return '';
    return errorMessages.length ? 'is-invalid' : 'is-valid';
  }

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        type={type}
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