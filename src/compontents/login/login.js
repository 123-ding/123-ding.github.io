import React, {Component} from 'react';
import {Link} from "react-router-dom";
import "./style.css"
import { Form, Input, Button,Icon} from 'antd';
import 'antd/dist/antd.css';
import axios from "axios"
import qs from "qs";
import "weui"

class Login extends Component {
    state={
        nickname:"",
        mobile:"",
        token:'',
        history: require("history").createHashHistory,
        ian:'',//控制数据加载时显示
    }

    handleSubmit = e => {
        this.setState({ian:1})
        e.preventDefault();
        const form= this.props.form
        const values= form.getFieldsValue()
        let data={
            mobile:values.phonenum,
            password:values.password
        }
        console.log(values)
        axios.post('https://www.it266.com/api/customer/token?access_key=16f51080af5aa6529b4e52f4c4cacc40',qs.stringify(data))
            .then(res=>{

                if (res.data.status){
                    setTimeout(()=>{
                        this.setState({ian:0})
                    },0)
                    this.setState({token:res.data.data.token})
                    window.localStorage.setItem('token',res.data.data.token)
                    this.state.history().push("/pages")

                }
            })

    };

    render() {

        const  getFieldDecorator  = this.props.form.getFieldDecorator;
        return (
            <div className="page">

                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h1>登录</h1>
                    <Form.Item>
                        {getFieldDecorator('phonenum', {
                            rules: [{ required: true, message: '请输入手机号' },
                                    {min:11,message: "手机号不得少于11位"},
                                    {max:11,message: "手机号不得多于11位"},
                                    {patern:/^1[0-9]{10}$/,message: "请输入正确的手机号"},
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入手机号"
                                autocomplete='off'
                            />,
                        )}

                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                            />,
                        )}

                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                         <Link to={"/resgin"}>如无账号请注册</Link>

                    </Form.Item>
                </Form>
                <div id="loadingToast" style={{display: this.state.ian===1?'block':"none"}}>
                    <div className="weui-mask_transparent"></div>
                    <div className="weui-toast">
                        <i className="weui-loading weui-icon_toast"></i>
                        <p className="weui-toast__content">登录中</p>
                    </div>
                </div>

            </div>
        );
    }
}



const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm