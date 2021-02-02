// React
import { useState } from 'react';
import { useQuery } from 'react-query';
// Components
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
// Styles
import { Wrapper, StyledButton } from './App.styles';
// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

const getProducts = async (): Promise<CartItemType[]> => 
  await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products', 
    getProducts
  );
  
  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(currentCartItems => {
      // Check if item is already in the cart, if it is only update the amount / total price
      const alreadyInCart = currentCartItems.find(item => item.id === clickedItem.id);
      if(alreadyInCart) {
        return currentCartItems.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // Item is not currently in the cart
      return [...currentCartItems, { ...clickedItem, amount: 1}];
    })
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(currentCartItems => 
      currentCartItems.reduce((ack, item) => {
        if(item.id === id) {
          if(item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }]
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    )
  };

  if(isLoading) return <LinearProgress />;
  if(error) return <div>Something went wrong</div>

  return (
    <div className="App">
      <Wrapper>
        <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
          <Cart 
            cartItems={cartItems} 
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
          />
        </Drawer>
        <StyledButton onClick={() => setCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color='error'>
            <AddShoppingCartIcon />
          </Badge>
        </StyledButton>
        <Grid container spacing={3}>
          { data?.map((item: CartItemType) => (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          )) }
        </Grid>
      </Wrapper>
    </div>
  );
}

export default App;
