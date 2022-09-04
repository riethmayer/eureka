const checkFree = (index, row, board) => {
  const rowItems = (row, board) => {
    return Object.keys(board).filter((i) => {
      return board[i].row === row
    }).map((i) => parseInt(i, 10))
  }
  
  const items = rowItems(row, board)
  switch(true) {
    case (row === 3 && index === 30):
      return rowItems(4, board).length === 0
    case (row === 3 && index === 41):
      return rowItems(6, board).length === 0
    case (row === 5 && index === 43):
      return rowItems(4, board).length === 0
    case (row === 5 && index === 54):
      return rowItems(6, board).length === 0
    case (row === 6 && index === 56):
      return true
    case (row === 6 && index === 55):
      return rowItems(6,board).length === 1 // is last element in its row
    case (row === 20 || row === 21):
      /* 4 tiles below the top tile only clickable after top tile is gone */ 
      return rowItems(22, board).length === 0
    default:
      return (index === items[items.length- 1]) || (index === items[0])
  }
}

export default checkFree;