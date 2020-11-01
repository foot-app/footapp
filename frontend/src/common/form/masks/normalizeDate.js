const normalizeDate = (value, prevValue) => {
    if (!value) return value;
  
    const valueOnlyNumbers = value.replace(/[^\d]/g, '');
    const prevValueOnlyNumbers = prevValue && prevValue.replace(/[^\d]/g, '');
  
    if (valueOnlyNumbers === prevValueOnlyNumbers) return value;
  
    const day = valueOnlyNumbers.slice(0, 2);
    const month = valueOnlyNumbers.slice(2, 4);
    const year = valueOnlyNumbers.slice(4, 8);
  
    if (valueOnlyNumbers.length < 2) return `${day}`;
    if (valueOnlyNumbers.length == 2) return `${day}/`;
    if (valueOnlyNumbers.length < 4) return `${day}/${month}`;
    if (valueOnlyNumbers.length == 4) return `${day}/${month}/`;
    if (valueOnlyNumbers.length > 4) return `${day}/${month}/${year}`;
  }

  export default normalizeDate