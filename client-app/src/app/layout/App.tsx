import { useEffect, useState } from 'react'
import axios from 'axios';
import { Container, Icon, Menu, Sidebar, } from 'semantic-ui-react';
import { Product } from '../models/product';
import NavBar from './NavBar';
import ProductDashboard from '../../features/products/dashboard/ProductDashboard';

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get<Product[]>('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])
  return (
    <>
      <NavBar />
      <Sidebar.Pusher as={Menu} style={{ marginTop: '53px' }}
        fixed='left'
        icon='labeled'
        vertical
        visible="true"
        width='thin'
      >
        <Menu.Item as='a'>
          <Icon name='home' />
          Home
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='gamepad' />
          Games
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>
      </Sidebar.Pusher>
      <Container style={{ marginTop: '7em', width: '90%' }}>
        <ProductDashboard products={products} />
      </Container>

    </>
  )
}

export default App
