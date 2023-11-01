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

  currency(
    value: string,
    type: "format" | "unformat" = "format",
    withSymbol: boolean = true
  ) {
    if (type === "format") {
      const formatToBRL = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return withSymbol
        ? formatToBRL.format(Number(value))
        : formatToBRL.format(Number(value)).replace("R$", "").trim();
    }

    const DIVISOR = 100;
    const DECIMAL_PLACES = 2;
    if (!value || value === "R$ 0,00" || value === "R$ 0,0") {
      return null;
    }

    if (typeof value === "number") {
      return value;
    }

    const valueNoCaracteres = value.replace(/[a-zA-Z$ ,.]/g, "");
    const valueString = (Number(valueNoCaracteres) / DIVISOR).toFixed(
      DECIMAL_PLACES
    );

    if (isNaN(Number(valueString))) {
      return "";
    }

    if (Number(valueString) === 0) {
      return "";
    }

    return Number(valueString);
  }
}
export const formatter = new Formatter();
