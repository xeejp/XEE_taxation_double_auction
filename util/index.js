export function getMode(mode) {
  switch(mode) {
    case 'wait':
      return '待機'
    case 'description':
      return '説明'
    case 'auction':
      return '実験'
    case 'result':
      return '結果'
    default:
      return mode
  }
}

export function getRole(role) {
  switch (role) {
    case 'buyer':
      return '買い手'
    case 'seller':
      return '売り手'
    default:
      return '不参加'
  }
}
