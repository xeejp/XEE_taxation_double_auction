export function getMode(mode) {
  switch(mode) {
    case 'wait':
      return '待機'
    case 'description':
      return '実験説明'
    case 'auction':
      return 'ダブルオークション'
    case 'result':
      return '結果'
    default:
      return mode
  }
}

export function getRole(role) {
  return role == "buyer"
    ? "買い手"
    : "売り手"
}
