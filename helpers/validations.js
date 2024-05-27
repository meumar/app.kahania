export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
}

export function passwordValid(password) {
  if (password && password.length > 6) {
    const alphabetRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
    if (alphabetRegex.test(password) && numberRegex.test(password)) {
      return true;
    }
  }

  return false;
}

export function nameValid(name) {
  if (name && name.length > 3) {
    return true;
  }

  return false;
}
