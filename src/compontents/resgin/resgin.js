import React, {Component} from 'react';
import axios from "axios"
import qs from "qs"
import "weui"
import "./style.css"
import {Link} from "react-router-dom";
import {
    Form,
    Input,

    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
} from 'antd';
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

class Resgin extends Component {
    state={
        cat:"",
        phonenum:"",//手机号
        password:"",//密码
        verify:"",//手机验证码
        message:"",//手机号码输入错误的提示信息
        messages:"",//验证码输入错误的提示信息
        code:"获取验证码",//倒计时
        url:"",//安全验证的url
        bool:false,//判断安全验证是否显示
        selfClick:1,//改变倒计时
        selfNum:"",//输入的安全验证码
        captcha_key:"",//安全验证码的key
        verification_key:"", //短信验证码key
        verification_code:'',//短信验证码
        mess:" ",//密码输入不符合要求的提示信息
        access_key:"16f51080af5aa6529b4e52f4c4cacc40",//秘钥
        mobile:"",//手机号
        nickname:"",//昵称
        avatar:"",//头像
        token:'',
        history: require("history").createHashHistory,
        ian:'',//控制数据加载时显示
    }

    hangldChang=(e,name)=>{
        this.setState({[name]:e.target.value})
    }
    handleBlur=()=>{
        var er=/^1[0-9]{10}$/
        if (!er.test(this.state.phonenum)){
            return;
        }else{
            this.setState({bool:1})
            axios.post("https://www.it266.com/api/image/captcha")
                .then((result)=>{
                    console.log(result)
                    this.setState({url:result.data.data.url,bool:true,captcha_key:result.data.data.captcha_key})
                })
        }
    }
    //安全验证码点击请求服务器
    hangleClick=()=>{
        this.setState({selfClick:0})
        this.setState({bool:false})



    }
    //获取验证码,倒计时
    handleClicks=()=>{
        var t=60
        var set=setInterval(()=>{
            this.setState({code:t+"s"})
            // this.setState({code:this.state.code--})

            t--
            if (t<0){
                clearInterval(set)
                this.setState({code:"获取验证码",bool:0})

            }
        },1000)
        let data ={
            mobile:this.state.phonenum,
            captcha_code:this.state.selfNum,
            captcha_key:this.state.captcha_key,
            access_key:'16f51080af5aa6529b4e52f4c4cacc40'
        }
        axios.post('https://www.it266.com/api/sms/verification',qs.stringify(data))
            .then(result=>{

                if (result.status){
                    console.log(result)
                    this.setState({verification_key:result.data.data.verificationKey})
                    console.log(this.state.verification_key)
                }else {
                    alert(result.data.data)
                    return
                }
            })
    }
    handleClickes=()=>{
        this.setState({ian:1})
        let data ={
            mobile: this.state.phonenum,
            password :this.state.password,
            nickname: this.state.nickname,
            verification_key:this.state.verification_key ,//短信验证码key,调⽤ /api/sms/verification 接⼝得到
            verification_code:this.state.verification_code,
        }
        axios.post(`https://www.it266.com/api/customer/create?access_key=${this.state.access_key}`,qs.stringify(data))
            .then((result)=>{
                if (result.status){
                    setTimeout(()=>{
                        this.setState({ian:0})
                    },0)
                    this.setState({token:result.data.data.token})
                    window.localStorage.setItem('token',this.state.token)
                    this.state.history().push("/login")

                }else{
                    alert(this.result.data.message)
                }
            })

    }
    render() {
         const  getFieldDecorator  = this.props.form.getFieldDecorator;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 24,
                    offset: 0,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>,
        );
        return (
            <div className={"regin"}>
                <h1>注册</h1>
                <Form {...formItemLayout}>
                    <Form.Item>
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '请输入手机号!' }],
                        })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} autocomplete='off' placeholder="请输入手机号"  onChange={(e)=>{this.hangldChang(e,"phonenum")}} onBlur={this.handleBlur}/>)}
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={8}>
                            <Col span={15}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: '请输入你得到的验证码!' }],
                                })(<Input placeholder="请输入验证码" autocomplete='off' onChange={(e)=>{this.hangldChang(e,"verification_code")}}/>)}
                            </Col>
                            <Col span={7}>
                                <Button onClick={this.handleClicks} style={{width:"100px"}}>{this.state.code}</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item  hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                                {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password placeholder="请输入密码" autocomplete='off'/>)}
                    </Form.Item>
                    <Form.Item  hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: '请再次输入密码!',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} autocomplete='off' placeholder="请再次输入密码" onChange={(e)=>{this.hangldChang(e,"password")}}/>)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('nickname', {
                            rules: [{ required: true, message: '请输入用户名', whitespace: true }],
                        })(<Input  placeholder="请输入用户名" onChange={(e)=>{this.hangldChang(e,"nickname")}} autocomplete='off'/>)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        {getFieldDecorator('agreement', {
                            valuePropName: 'checked',
                        })(
                            <Checkbox>
                                请阅读<Link to={""}>协议</Link>
                            </Checkbox>,
                        )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" className={"btn"} onClick={this.handleClickes}>
                            注册
                        </Button>
                    </Form.Item>
                    <Link to={"/login"}>如有账号,请登录</Link>
                </Form>
                <div>
                    {this.state.bool?(
                        <div className={"resgin"}>

                            <div className={"self"}>
                                <div className={"selfC"}>安全验证</div>
                                <div className={"selfI"}>
                                    <img src={this.state.url} width={"130"} height={"80"}/>
                                    <span onClick={this.hangleBlurs}>换一换</span>
                                </div>

                                <div className={"selfB"}>
                                    <input type="text" placeholder={"请输入验证码"} onChange={(e)=>{
                                        this.hangldChang(e,"selfNum")
                                    }}/>
                                    <button onClick={this.hangleClick}>确认</button>
                                </div>
                            </div>

                        </div>
                    ):null}
                </div>
                <div id="loadingToast" style={{display: this.state.ian===1?'block':"none"}}>
                    <div className="weui-mask_transparent"></div>
                    <div className="weui-toast">
                        <i className="weui-loading weui-icon_toast"></i>
                        <p className="weui-toast__content">注册成功</p>
                    </div>
                </div>


            </div>

        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Resgin);
export default WrappedNormalLoginForm

