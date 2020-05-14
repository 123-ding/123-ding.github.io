import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { Menu, Dropdown, Button, Icon, message } from 'antd';
import { Input } from 'antd';
import "weui"
import axios from "axios"
import qs from "qs";
import "./style.css"
import imgs from "../imgs/1111.png"
import img2 from "../imgs/7.png"
class Pages extends Component {
    state={
        token:window.localStorage.getItem('token'),
        nickname:'',//用户名
        phonenum:"",//手机号
        item_count:'',//总记录数
        length:[],//获取信息
        ian:''//控制数据加载时显示

    }
    getRemind(){
        this.setState({ian:1})
        axios.get(`https://www.it266.com/app/todo?token=${this.state.token}`).then(res=>{
            if (res.status){
                setTimeout(()=>{
                    this.setState({
                        item_count:res.data.data.page.item_count,
                        length:res.data.data.data,
                        ian:0
                    })
                },0)

            }
        }).catch(error=>{
            alert(error)
        })
    }
    componentDidMount(){
        let data={
            token:window.localStorage.getItem('token')
        }
        axios.get(`https://www.it266.com/api/customer/whoami?token=${this.state.token}`,qs.stringify(data))
            .then(res=>{
                if (res.status){
                    this.setState({nickname:res.data.data.nickname,phonenum:res.data.data.mobile})
                    this.getRemind()
                }
        }).catch((error)=>{
                alert(error)
            })
    }
    handleMenuClick(e) {
        message.info('Click on menu item.');
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">
                    <Icon type="user" />
                    用户名:{this.state.nickname}
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="user" />
                    手机号:{this.state.phonenum}
                </Menu.Item>
            </Menu>
        );
        const { Search } = Input;
        return (
            <div>
                <div className={'titles'}>
                    <Link to={"/login"} className={"edit"}><Icon type="plus" />退出登录</Link>
                    <div id="components-dropdown-demo-dropdown-button" className={"use"}>
                        <Dropdown.Button overlay={menu} icon={<Icon type="home" />}>
                            用户管理
                        </Dropdown.Button>
                    </div>
                </div>
                <div className={"search"}>
                    <Search
                        onSearch={value => console.log(value)}
                    />
                </div>
                <div className={"content"}>
                    <Link  to={"/all"} onClick={()=>{
                        window.sessionStorage.setItem('titles','新增');
                        window.sessionStorage.setItem('title','列表');
                        window.sessionStorage.setItem('num','1');

                    }}>
                        <div>
                            <div >
                                <img src={imgs} alt=""/>
                            </div>
                            <p >新增</p>
                        </div>
                        <div className={"num"}><p >{}</p></div>
                    </Link>
                    <Link to={'/all'}onClick={()=>{
                        window.sessionStorage.setItem('titles',"全部");
                        window.sessionStorage.setItem('title','列表');
                        window.sessionStorage.setItem('num','1');

                    }}>
                        <div>
                            <div >
                                <img src={img2} alt=""/>
                            </div>
                            <p >全部</p>
                        </div>
                        <div className={"num"}><p >{this.state.item_count}</p></div>
                    </Link>
                </div>
                <div className={'list'}>
                    <div><h2>我的列表</h2></div>
                    {this.state.length.map((item,key)=>{
                    return(
                        <div className="weui-cells" key={"key"}>
                            <Link className="weui-cell  weui-cell_access weui-cell_example" to={`/exit/${item.id}`} onClick={()=>{
                                window.sessionStorage.setItem('titles',"编辑");
                                window.sessionStorage.setItem('title','编辑');
                                window.sessionStorage.setItem('num','5');
                                window.sessionStorage.setItem('id',`${item.id}`);
                            }}>
                                <div className="weui-cell__bd">
                                    <p>{item.name}</p>
                                </div>

                            </Link>
                        </div>
                    )})}
                </div>
                <div id="loadingToast" style={{display: this.state.ian===1?'block':"none"}}>
                    <div className="weui-mask_transparent"></div>
                    <div className="weui-toast">
                        <i className="weui-loading weui-icon_toast"></i>
                        <p className="weui-toast__content">数据加载中</p>
                    </div>
                </div>
            </div>

        );
    }
}

export default Pages;