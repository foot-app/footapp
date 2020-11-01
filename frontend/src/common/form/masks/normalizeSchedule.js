const normalizeSchedule = (value, prevValue) => {
    const valueOnlyNumbers = value.replace(/[^\d]/g, '');
    const prevValueOnlyNumbers = prevValue && prevValue.replace(/[^\d]/g, '');

    if (valueOnlyNumbers === prevValueOnlyNumbers) return value;

    const hour = valueOnlyNumbers.slice(0, 2);
    const minute = valueOnlyNumbers.slice(2, 4);

    if (valueOnlyNumbers.length < 2) return `${hour}`;
    if (valueOnlyNumbers.length == 2) return `${hour}:`;
    if (valueOnlyNumbers.length <= 4) return `${hour}:${minute}`;
}

export default normalizeSchedule