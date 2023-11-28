import { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import { Product } from '../models/product';
import NavBar from './NavBar';
import ProductDashboard from '../../features/products/dashboard/ProductDashboard';
import { v4 as uuid } from 'uuid';
import SidebarNav from './SidebarNav';
import agent from '../api/Agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Products.filterList().then(responce => {
      const products: Product[] = [];
      responce.forEach(product => {
        products.push(product);
      })
      setProducts(products);
      setLoading(false);
    })
  }, [])

  function getAllProducts() {
    agent.Products.list().then(responce => {
      const products: Product[] = [];
      responce.forEach(product => {
        products.push(product);
      })
      setProducts(products);
      setLoading(false);
    })
  }

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
    setSubmitting(true);
    if (product.id) {
      agent.Products.update(product).then(() => {
        setProducts([...products.filter(x => x.id !== product.id), product])
        setSelectedProduct(product);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      product.id = uuid();
      product.createdOn = new Date();
      product.modifiedOn = null;
      product.deletedOn = null;
      product.unitId = '00000000-0000-0000-0000-000000000001'
      agent.Products.create(product).then(() => {
        setProducts([...products, product]);
        setSelectedProduct(product);
        setEditMode(false);
        setSubmitting(false);
      }).catch(error => {
        console.log(error);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteProduct(id: string) {
    setSubmitting(true);
    agent.Products.delete(id).then(() => {
      setProducts([...products.filter(x => x.id !== id)]);
      setSubmitting(false);
    }).catch(error => {
      console.log(error);
      setSubmitting(false);
    })
    setProducts([...products.filter(x => x.id !== id)]);
  }

  if (loading) return <LoadingComponent content='Зареждане...' />

  return (
    <>
      <NavBar openForm={handleFormOpen} />
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
          submitting={submitting}
          getAllProducts={getAllProducts}
        />
      </Container>

    </>
  )
}

export default App;
