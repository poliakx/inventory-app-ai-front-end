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