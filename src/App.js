import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Row, Col, Form, Navbar, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const indicators = [
  'uf', 'ivp', 'dolar', 'dolar_intercambio', 'euro', 'ipc', 'utm', 'imacec', 'tpm', 'libra_cobre', 'tasa_desempleo', 'bitcoin'
];

function App() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedIndicator, setSelectedIndicator] = useState('dolar');

  useEffect(() => {
    const fetchData = async (indicator) => {
      try {
        const response = await axios.get(`https://mindicador.cl/api/${indicator}`);
        const chartData = response.data.serie.slice(0, 30).reverse();
        setData({
          labels: chartData.map(item => new Date(item.fecha).toLocaleDateString()),
          datasets: [
            {
              label: `Precio de ${response.data.nombre}`,
              data: chartData.map(item => item.valor),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData(selectedIndicator);
  }, [selectedIndicator]);

  const handleIndicatorChange = (e) => {
    setSelectedIndicator(e.target.value);
    setLoading(true);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Indicadores Económicos</Navbar.Brand>
      </Navbar>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-4">Selecciona el Indicador</Card.Title>
                <Form>
                  <Form.Group controlId="indicatorSelect">
                    <Form.Control as="select" value={selectedIndicator} onChange={handleIndicatorChange}>
                      {indicators.map(indicator => (
                        <option key={indicator} value={indicator}>{indicator.toUpperCase()}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Form>
                {loading ? (
                  <div className="d-flex justify-content-center mt-4">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Cargando...</span>
                    </Spinner>
                  </div>
                ) : (
                  <Line data={data} />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
