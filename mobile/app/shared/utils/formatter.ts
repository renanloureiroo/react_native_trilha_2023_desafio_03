class Formatter {
  phone(value: string, type: "format" | "unformat" = "format") {
    if (!value) {
      return value;
    }

    const valueClean = value.replace(/\D/g, "");

    if (type === "format") {
      const numero = valueClean.slice(0, 11);
      const size = numero.length;

      if (size <= 2) {
        return valueClean;
      }
      if (size === 3) {
        return `(${numero.slice(0, 2)}) ${numero[2]}`;
      }

      if (size <= 7) {
        return `(${numero.slice(0, 2)}) ${numero[2]} ${numero.slice(3, 7)}`;
      }

      return `(${numero.slice(0, 2)}) ${numero[2]} ${numero.slice(
        3,
        7
      )} - ${numero.slice(7)}`;
    }

    return valueClean;
  }
}

export const formatter = new Formatter();
