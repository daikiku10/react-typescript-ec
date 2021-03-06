import React, { useEffect, useState } from 'react'
import { CartItem, ItemsList, ToppingsList } from '../redux/store/initialState'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, List, ListItemText, Box} from '@material-ui/core';


interface Props {
  getItems: ItemsList
  getToppings: ToppingsList
  getCart: CartItem | undefined
  deleteBtn: any
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});



const CartTable = ({getCart, getItems, getToppings, deleteBtn}: Props) => {
  const classes = useStyles();
  const [price, setPrice] = useState<number>(0);
  const [toppingPrice, setToppingPrice] =useState<number>(0);
  // 合計金額の処理
  useEffect(() => {
    let price = 0
    if(getCart){
      getCart.itemInfo.map(data => (
        getItems.filter(itemData => { return data.itemId === itemData.id 
        }).map(item => (
          (data.size === "M" ? price += item.priceM * data.buyNum : price += item.priceL * data.buyNum)
        ))
      ))
    }
    console.log('合計処理')
    setPrice(price)
  },[getCart,deleteBtn])
  // トッピング合計金額
  useEffect(() => {
    let toppingPr = 0
    if(getCart){
      getCart.itemInfo.map(data => (
        data.toppings.map(topping => (
          getToppings.filter(top => {return topping.id === top.id
          }).map(to => (
            toppingPr += to.price * data.buyNum
          ))
        ))
      ))
    }
    setToppingPrice(toppingPr)
  },[getCart,deleteBtn])
  

  return (
    <Container maxWidth="md">
      {getCart ? 
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">商品名</StyledTableCell>
                <StyledTableCell align="center">サイズ、価格、数量</StyledTableCell>
                <StyledTableCell align="center">トッピング価格</StyledTableCell>
                <StyledTableCell align="center">小計</StyledTableCell>
                <StyledTableCell align="center">削除</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCart.itemInfo.map((data, index) => (
                <StyledTableRow key={index}>
                  {getItems.filter(item => {
                    return data.itemId === item.id
                  }).map((item) => (
                    <React.Fragment key={index}>
                      <StyledTableCell component="th" scope="row">
                        <Typography><img src={item.imgPath} width="200" height="200" style={{objectFit: "cover"}}></img></Typography>
                        <Typography align="center">{item.title}</Typography>
                      </StyledTableCell> 
                      <StyledTableCell align="center">
                        { data.size === "M" ? <Typography>{item.priceM}円、{data.buyNum}杯</Typography> : <Typography>{item.priceL}円、{data.buyNum}杯</Typography> }
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.toppings.map((topping, ind) => (
                          <List key={ind}>
                            {getToppings.filter((top) => {
                              return topping.id === top.id
                            }).map((to) => (
                                <ListItemText key={ind}>{to.title} : {to.price}円、{data.buyNum}個</ListItemText>
                            ))}
                          </List>
                        ))}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography>【ﾗｰﾒﾝ】</Typography>
                        <Typography>{data.size==="M"? (item.priceM * data.buyNum ) : item.priceL * data.buyNum}円</Typography>
                        <Typography>【ﾄｯﾋﾟﾝｸﾞ】</Typography>
                        {data.toppings.map((topping, ind) => (
                          <React.Fragment key={ind}>
                            {getToppings.filter((top) => {
                              return topping.id === top.id
                            }).map((to) => (
                              <Typography key={ind}>{to.price * data.buyNum}円</Typography>
                            ))}
                          </React.Fragment>
                        ))}
                      </StyledTableCell>
                      <StyledTableCell align="center"><Button style={{ color: "#fff", backgroundColor: "#CF000D"}}  onClick={() => deleteBtn(index)}>削除</Button></StyledTableCell>
                    </React.Fragment>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <Box mt={2} mb={2}>
            <Typography variant="h5" align="center">消費税：{Math.floor((price + toppingPrice) * 0.1 / 1.1)}円</Typography>
            <Typography variant="h5" align="center">合計金額：{price + toppingPrice}円</Typography>
          </Box>
        </TableContainer>
      :
      <Typography>カート商品がありません！</Typography>
      }
    </Container>
  )
}

export default CartTable