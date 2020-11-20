const buildDate = (valueOnlyNumbers, day, month, year) => {
    let buildedDate = ""

    if (valueOnlyNumbers.length < 2) buildedDate = `${day}`;
    else if (valueOnlyNumbers.length == 2) buildedDate = `${day}/`;
    else if (valueOnlyNumbers.length < 4) buildedDate = `${day}/${month}`;
    else if (valueOnlyNumbers.length == 4) buildedDate = `${day}/${month}/`;
    else if (valueOnlyNumbers.length > 4) buildedDate = `${day}/${month}/${year}`;

    return buildedDate
}

const normalizeDate = (value, prevValue) => {
    if (!value) return value;
  
    const valueOnlyNumbers = value.replace(/[^\d]/g, '');
    const prevValueOnlyNumbers = prevValue && prevValue.replace(/[^\d]/g, '');
  
    if (valueOnlyNumbers === prevValueOnlyNumbers) return value;
  
    const day = valueOnlyNumbers.slice(0, 2);
    const month = valueOnlyNumbers.slice(2, 4);
    const year = valueOnlyNumbers.slice(4, 8);
  
    return buildDate(valueOnlyNumbers, day, month, year)
  }

  export default normalizeDate