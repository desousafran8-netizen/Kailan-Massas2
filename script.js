body {
  font-family: Arial, sans-serif;
  background: #f8f8f8;
  color: #333;
  margin: 0;
  padding: 0;
}

header {
  background: #c0392b;
  color: white;
  text-align: center;
  padding: 20px;
}

h1 {
  margin: 0;
}

nav {
  display: flex;
  justify-content: center;
  background: #e74c3c;
  padding: 10px;
}

.menu-btn {
  background: white;
  border: none;
  margin: 5px;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.menu-btn:hover {
  background: #ffe6e6;
}

#menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 10px;
  padding: 20px;
}

.item {
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.item h3 {
  margin-top: 0;
}

.item button {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.item button:hover {
  background: #1e8449;
}

#carrinho, #dados-cliente, #nota {
  background: white;
  margin: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

#finalizar, #imprimir, #enviar {
  background: #c0392b;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-top: 10px;
  border-radius: 6px;
  cursor: pointer;
}

#finalizar:hover, #imprimir:hover, #enviar:hover {
  background: #922b21;
}

.hidden {
  display: none;
}

footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 0.9em;
}
