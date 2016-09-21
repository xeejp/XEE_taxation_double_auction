export function calculateTax(usersCount, taxTarget, taxType, lumpSumTax, proportionalRatio, regressiveRatio, progressiveRatio, role, money) {
  if (taxTarget == "both" || taxTarget == role) {
    switch (taxType) {
      case "lump_sum":
        return lumpSumTax
      case "proportional":
        return Math.floor(proportionalRatio * money / 100)
      case "regressive":
        return Math.floor(regressiveRatio * Math.sqrt(money) / 100)
      case "progressive":
        const max = usersCount * 100
        return Math.floor(progressiveRatio * money * money / max / 100)
    }
  } else {
    return 0;
  }
}

export function applyTax(role, bid, tax) {
  return role == "buyer" ? bid - tax : bid + tax
}
