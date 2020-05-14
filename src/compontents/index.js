import React, {Component} from 'react';
import Login from "./login/login.js"
import Resgin from "./resgin/resgin.js"
import Pages from "./pages/pages.js"
import All from "./all/all.js"
import Exit from "./exit/exit.js"
import {HashRouter,Switch,Route} from "react-router-dom"
class Index extends Component {

    render() {
        return (
            <HashRouter>

                <Switch>
                    <Route exact path="/" >
                        <Resgin  />
                    </Route>
                    <Route  path="/login" >
                        <Login  />
                    </Route>
                    <Route  path="/resgin" >
                        <Resgin  />
                    </Route>
                     <Route  path="/pages" >
                        <Pages   />
                    </Route>
                    <Route path={"/all"}>
                        <All />
                    </Route>
                    <Route path={"/exit/:id"}>
                        <Exit />
                    </Route>

                </Switch>
            </HashRouter>
        );
    }
}

export default Index;