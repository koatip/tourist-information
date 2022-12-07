export default function useValidation() {

  const validators = {
    name: [
      {
        fn: isNotEmpty,
        errorMessage: 'Hiányzó érték'
      }
    ],
    settlement: [
      {
        fn: isNotEmpty,
        errorMessage: 'Hiányzó érték'
      }
    ],
    address: [
      {
        fn: isNotEmpty,
        errorMessage: 'Hiányzó érték'
      }
    ],
    category: [
      {
        fn: isNotEmpty,
        errorMessage: 'Hiányzó érték'
      }
    ],
    price: [
      {
        fn: isNotEmpty,
        errorMessage: 'Hiányzó érték'
      },
      {
        fn: isNotNegative,
        errorMessage: 'Nem lehet kisebb, mint 0'
      }
    ],
    note: [
      {
        fn: isNotLong,
        errorMessage: 'Nem lehet több, mint 1000 karakter'
      },
    ]
  }

  function isNotEmpty(value) {
    return value !== ''
  }
  
  function isNotNegative(value) {
    return value >= 0
  }

  function isNotLong(value) {
    return value.length <= 1000
  }
  

  function reportFieldValidity(inputName, inputValue, setErrorMessages) {
    const inputValidators = validators[inputName]
    const inputValidationResults = inputValidators
      .map(inputValidator => {
        const { fn: validatorFn, errorMessage: validatorErrorMessage } = inputValidator
        const isValid = validatorFn(inputValue)
        return isValid ? '' : validatorErrorMessage
      })
      .filter(errorMessage => errorMessage !== '')

    setErrorMessages(data => ({
      ...data,
      [inputName]: inputValidationResults
    }))

    return inputValidationResults.length === 0
  }

  function reportFormValidity(formData, setErrorMessages) {
    const inputNames = Object.keys(validators)
    const inputValidations = inputNames.map(inputName => reportFieldValidity(inputName, formData[inputName], setErrorMessages))

    let isValid = inputValidations.every(isValid => isValid)
    
    return isValid
  }

  return reportFormValidity;
}