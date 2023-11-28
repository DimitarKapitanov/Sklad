import { useEffect } from 'react'
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ProductDashboard from '../../features/products/dashboard/ProductDashboard';
import SidebarNav from './SidebarNav';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const { productStore } = useStore();

  useEffect(() => {
    productStore.loadProducts();
  }, [productStore])

  if (productStore.loadingInitial) return <LoadingComponent content='Зареждане...' />

  return (
    <>
      <NavBar />
      <SidebarNav />
      <Container style={{ marginTop: '7em', width: '90%' }}>
        <ProductDashboard />
      </Container>
    </>
  )
}

export default observer(App);
