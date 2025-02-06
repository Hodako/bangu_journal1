import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ResponsiveResearchPlatform from './components/Home';
import ArticlePage from './components/Article';
import AuthPages from './components/Auth';
import BlogspotEditor from './components/Upload';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ResponsiveResearchPlatform} />
        <Route path="/article/:id" component={ArticlePage} />
        <Route path="/auth" component={AuthPages} />
        <Route path="/upload" component={BlogspotEditor} />
      </Switch>
    </Router>
  );
};

export default App;
