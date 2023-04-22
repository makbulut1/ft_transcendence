// API Error Codes
export const APIErrCodeEmailRequired = 'auth/email-required'
export const APIErrCodeUsernameRequired = 'auth/username-required'
export const APIErrCodeUsernameTooLong = 'auth/username-too-long'
export const APIErrCodeUsernameTooShort = 'auth/username-too-short'
export const APIErrCodeMissingAuthHeader = 'auth/missing-header'

// Firebase Error Codes
export const FBErrCodeEmailAlreadyUsedIn = 'auth/email-already-in-use'
export const FBErrCodeEmailInvalid = 'auth/invalid-email'
export const FBErrCodeOperationNotAllowed = 'auth/operation-not-allowed'
export const FBErrCodeUserDisabled = 'auth/user-disabled'
export const FBErrCodeUserNotFound = 'auth/user-not-found'
export const FBErrCodeWeakPassword = 'auth/weak-password'
export const FBErrCodeWrongPassword = 'auth/wrong-password'

// Error Messages
export const ErrMsgEmailAlreadyUsedIn = 'Email already in use!'
export const ErrMsgEmailInvalid = 'Invalid email! Please correct your email!'
export const ErrMsgEmailRequired = 'Email required! Please provide your email!'
export const ErrMsgNetworkError = 'Network error! If it will continue please contact us!'
export const ErrMsgOperationNotAllowed = 'Operation not allowed! Please contact with developers!'
export const ErrMsgSomethingWentWrong = 'Something went wrong! Maybe our services not working!'
export const ErrMsgUserDisabled = 'Your account disabled! Please contact with developers!'
export const ErrMsgUserNotFound = 'There is no registered user with this email address!'
export const ErrMsgUsernameRequired = 'Username required! Please provide an username!'
export const ErrMsgUsernameTooLong = 'Username too long!'
export const ErrMsgUsernameTooShort = 'Username too short!'
export const ErrMsgWeakPassword = 'Password is weak! Please provide more strong password!'
export const ErrMsgWrongPassword = 'Password is wrong! Please try again!'

export const fbErrorHandler = (code: string) => {
  switch (code) {
    case FBErrCodeEmailAlreadyUsedIn: {
      return ErrMsgEmailAlreadyUsedIn
    }
    case FBErrCodeOperationNotAllowed: {
      return ErrMsgOperationNotAllowed
    }
    case FBErrCodeWeakPassword: {
      return ErrMsgWeakPassword
    }
    case FBErrCodeEmailInvalid: {
      return ErrMsgEmailInvalid
    }
    case FBErrCodeUserDisabled: {
      return ErrMsgUserDisabled
    }
    case FBErrCodeUserNotFound: {
      return ErrMsgUserNotFound
    }
    case FBErrCodeWrongPassword: {
      return ErrMsgWrongPassword
    }
    default:
      return ErrMsgSomethingWentWrong
  }
}

export const apiErrorHandler = (code: string) => {
  switch (code) {
    case APIErrCodeEmailRequired: {
      return ErrMsgEmailRequired
    }
    case APIErrCodeUsernameRequired: {
      return ErrMsgUsernameRequired
    }
    case APIErrCodeUsernameTooLong: {
      return ErrMsgUsernameTooLong
    }
    case APIErrCodeUsernameTooShort: {
      return ErrMsgUsernameTooShort
    }
    default:
      return ErrMsgSomethingWentWrong
  }
}
