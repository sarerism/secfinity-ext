import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-chrome-extension-router';
import { FloatButton } from 'antd';
import { QueryClientProvider, QueryClient } from 'react-query';
import LayoutApp from './components/LayoutApp';
import './assets/css/style.css';

const queryClient = new QueryClient();

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <LayoutApp>
            <Router>
                <div />
            </Router>
            <FloatButton.BackTop />
        </LayoutApp>
    </QueryClientProvider>,
    document.getElementById('app')
);
