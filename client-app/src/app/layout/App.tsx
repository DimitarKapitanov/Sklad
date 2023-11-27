import { useEffect, useState } from 'react'
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Product } from '../models/product';
import NavBar from './NavBar';
import ProductDashboard from '../../features/products/dashboard/ProductDashboard';
import { v4 as uuid } from 'uuid';
import SidebarNav from './SidebarNav';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Product[]>('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  function handleSelectProduct(id: string) {
    setSelectedProduct(products.find(x => x.id === id));
  }

  function handleCancelSelectProduct() {
    setSelectedProduct(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectProduct(id) : handleCancelSelectProduct();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditProduct(product: Product) {
    product.id ? setProducts([...products.filter(x => x.id !== product.id), product]) 
               : setProducts([...products, {...product, id: uuid()}]);

    setEditMode(false);
    setSelectedProduct(product);
  }

  function handleDeleteProduct(id: string) {
    setProducts([...products.filter(x => x.id !== id)]);
  }

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <SidebarNav />
      <Container style={{ marginTop: '7em', width: '90%' }}>
        <ProductDashboard
          products={products}
          selectedProduct={selectedProduct}
          selectProduct={handleSelectProduct}
          cancelSelectProduct={handleCancelSelectProduct}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditProduct}
          deleteProduct={handleDeleteProduct}
        />
      </Container>

    </>
  )
}

export default App;
