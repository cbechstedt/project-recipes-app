import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import shareIcon from '../images/shareIcon.svg';
import Header from '../components/Header';

const copy = require('clipboard-copy');

export default function DoneRecipes() {
  const [data, setData] = useState([]);
  const [filterBy, setFilterBy] = useState('all');
  const [showMessage, setShowMessage] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const getLocal = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    setData(getLocal);
  }, []);

  const shareRecipe = (receita) => {
    const path1 = window.location.href.replace('/done-recipes', '');
    const path2 = `${path1}/${receita.type}s/${receita.id}`;
    copy(path2);
    setShowMessage(true);
  };

  const sendTo = (receita) => {
    const { location: { pathname } } = history;
    const path1 = pathname.replace('/done-recipes', '');
    const path2 = `${path1}/${receita.type}s/${receita.id}`;
    return path2;
  };

  const handleFilter = (type) => {
    setFilterBy(type);
  };

  const filtroDoneRecipes = (obj) => {
    if (filterBy === 'meals') return obj.filter((receita) => receita.type === 'meal');
    if (filterBy === 'drinks') return obj.filter((receita) => receita.type === 'drink');
    return obj;
  };

  return (
    <div>
      <Header />
      <Navbar bg="light" variant="light" style={ { width: '360px' } }>
        <Container>
          <Nav className="me-auto">
            <Nav.Link
              data-testid="filter-by-all-btn"
              onClick={ () => handleFilter('all') }
            >
              All
            </Nav.Link>
            <Nav.Link
              data-testid="filter-by-meal-btn"
              onClick={ () => handleFilter('meals') }
            >
              Meals
            </Nav.Link>
            <Nav.Link
              data-testid="filter-by-drink-btn"
              onClick={ () => handleFilter('drinks') }
            >
              Drinks
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      { filtroDoneRecipes(data)?.map((recipe, idx) => (
        <Card key={ recipe.id } style={ { margin: '0 0 20px' } }>
          <Link to={ sendTo(recipe) }>
            <Card.Img
              variant="top"
              src={ recipe.image }
              data-testid={ `${idx}-horizontal-image` }
              onClick={ () => sendTo(recipe) }
            />
          </Link>
          <Card.Body>
            <Card.Title
              data-testid={ `${idx}-horizontal-name` }
            >
              <Link to={ sendTo(recipe) }>
                { recipe.name }
              </Link>
              <button
                type="button"
                className="search-top"
                onClick={ () => shareRecipe(recipe) }
              >
                <img
                  src={ shareIcon }
                  alt="shareIcon"
                  data-testid={ `${idx}-horizontal-share-btn` }
                />
              </button>
            </Card.Title>
            { showMessage && (
              <Card.Text>
                <Alert>
                  Link copied!
                </Alert>
              </Card.Text>
            ) }
            <Card.Text>
              { recipe.tags.map((tagName) => (
                <Badge
                  data-testid={ `${idx}-${tagName}-horizontal-tag` }
                  key={ tagName }
                >
                  { tagName }
                </Badge>)) }
            </Card.Text>
            <ListGroup className="list-group-flush">
              <ListGroup.Item data-testid={ `${idx}-horizontal-top-text` }>
                { (recipe.type === 'meal')
                && (`${recipe.nationality} - ${recipe.category}`) }
                { (recipe.type === 'drink') && (`${recipe.alcoholicOrNot}`) }
              </ListGroup.Item>
              <ListGroup.Item data-testid={ `${idx}-horizontal-done-date` }>
                { recipe.doneDate }
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
