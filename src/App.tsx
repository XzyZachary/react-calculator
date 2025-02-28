import React from 'react';
import Calculator from './components/Calculator';
import './styles/App.scss';

const App: React.FC = () => {
  return (
    <div className="app">
      <main>
        <Calculator />
        {/* Calculator components will be added here */}
      </main>
    </div>
  );
};

export default App;
