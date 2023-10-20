class Validator {
  isPhoneNumber(value: string) {
    if (!value) {
      return false;
    }
    const valueWithoutCaracteres = value.replace(/\D/g, "");

    const regex = /^(\d{2})9(\d{4})(\d{4})$/;
    return regex.test(valueWithoutCaracteres);
  }
}

export const validator = new Validator();
