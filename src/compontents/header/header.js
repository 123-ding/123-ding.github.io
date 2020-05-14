import React, {Component} from 'react';
import "weui"
import "./style.css"
import "../icons/iconfont.css"
import {Link} from "react-router-dom";

class Header extends Component {

        state = {
             title:'',
            num:'',
        };


    componentDidMount() {
        this.setState(nextState=>{
            return{
                title:window.sessionStorage.getItem('title'),
                num:window.sessionStorage.getItem('num')
            }
        })

        // console.log(this.state)

    }

    goback = () => {

        setTimeout(() => {
            this.setState({title:window.sessionStorage.removeItem("title")})
            this.setState({num:window.sessionStorage.removeItem("num")})
        },0)

    }
    render() {

        return (
            <div className={"header"}  >
                {this.state.num?<Link to={'/pages'} className={"img"} onClick={this.goback}><span className="icon iconfont ">&#xe600;</span></Link>:' '}
                <div className={"title"}>{this.state.title}</div>
            </div>

        );
    }
}

export default Header;