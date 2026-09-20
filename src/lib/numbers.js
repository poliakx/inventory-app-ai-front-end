const EMPTY = "—"

export const toNumber = (value) => {
  const notNum = [undefined, null, ""]
  if(notNum.includes(value)) {
    return null
  } else {
    const number = Number(value) 
    if(Number.isNaN(number)){
      return null
    } else {
      return number
    }
  }
}

export const formatMoney = (value) => {
  const number = toNumber(value)
  if (number === null) return EMPTY
  return number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
}

export const formatAmount = (value) => {
  const number = toNumber(value)
  if (number === null) return EMPTY
  return number.toLocaleString(undefined, {maximumFractionDigits: 3})
}

export const formatPercent = (value) => {
  const number = toNumber(value)
  if (number === null) return EMPTY
  return `${number.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}%`
}