import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])
  return (
    <div>
      <Header as='h1' icon='users' content='Sklad'/>
      <List>
        {products.map((product: any) => (
          <List.Item key={product.id}>
            {product.name} / {product.quantity}{product.unit.acronym} / {product.price} / {product.description} / {product.category} / {product.unit.name} /  {product.unit.type}
          </List.Item>
        ))}
      </List>
    </div>

  )
}

export default App
