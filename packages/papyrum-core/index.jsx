import React from 'react';
import ReactDOM from 'react-dom';
import Md from './demo.mdx';
const App = () => {
    return <div>hola
        <Md />
    </div>
}

const node = document.createElement('div');
document.body.appendChild(node);

ReactDOM.render(<App />, node);



