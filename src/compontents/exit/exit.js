import React, {Component} from 'react';
import Header from "../header/header";
import axios from "axios";
import "weui"
import "./style.css"
import $ from "jquery";
import weui from 'weui.js'
import qs from "qs";
class Exit extends Component {
    state={
        id:window.sessionStorage.getItem('id'),
        token:window.localStorage.getItem('token'),
        remind_at:'',
        name:'',
        repeat:"",
        num:'',
        message:'',//获取信息
        history: require("history").createHashHistory,
    }
    change=(repeat,remind_at)=>{
        let _this=this;
        $('#showPicker').on('click',  function(repeat){
            weui.picker([{
                label: '不重复',
                value: 0
            }, {
                label: '每天',
                value: 1
            }, {
                label: '每周',
                value: 2
            },{
                label: '每月',
                value: 3
            }, {
                label: '每季度',
                value: 4
            },{
                label: '每年',
                value: 5
            }], {
                onChange: function (result) {

                },
                onConfirm: function (result) {
                    repeat=result[0].value
                    _this.setState({repeat:result[0].value})
                    console.log(_this.state)
                },
                title: '重复'
            });
        });
        $('#showDatePicker').on('click', function (remind_at) {
            let years = [];
            let mouth =[];
            let date = [];
            let hours = [];
            let minite = [];
            let seconds = [];
            if(!years.length&&!mouth.length) {
                for(let i = 2020; i <= 2030; i++) {
                    years.push({
                        label: i +"年" ,
                        value: i
                    });
                }
            }

            function costomDatePicker(years,startTime,endTime,str){
                for(let j = startTime; j < endTime; j++) {
                    years.push({
                        label: ('' + j).length === 1 ? '0'+j + str : '' + j + str,
                        value: ('' + j).length === 1 ? '0'+j : '' + j ,
                    });
                }
                return years;
            }

            if (!mouth.length) {
                mouth = costomDatePicker(mouth,1,13,"月" )
            }
            if(!date.length) {
                date = costomDatePicker(date,1,32,"日" )
            }
            if(!hours.length) {
                hours=costomDatePicker(hours,0,24,"时")
            }
            if(!minite.length) {
                minite=costomDatePicker(minite,0,60,"分")
            }
            if(!seconds.length) {
                seconds=costomDatePicker(seconds,0,60,"秒")
            }
            weui.picker(years,mouth,date,hours,minite,seconds,{
                start: new Date(),
                end : 2022,
                defaultValue: [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate(),new Date().getHours(),new Date().getMinutes(),new Date().getSeconds()],
                onConfirm: result=> {
                    remind_at=result[0].value+'-'+result[1].value+'-'+result[2].value+' '+result[3].value+':'+result[4].value+':'+result[5].value;
                    _this.setState({remind_at:remind_at})
                    console.log(_this.state)
                },
                title: '日期'
            });
        });
    }
    getApi(){
        axios.get(`https://www.it266.com/app/todo/detail?id=${this.state.id}&token=${this.state.token}`).then(res=>{
            if (res.status){
                this.setState({remind_at:res.data.data.remind_at,
                    name:res.data.data.name,
                    repeat:res.data.data.repeat})
                // this.setState({item_count:res.data.data.page.item_count,length:res.data.data.data})
                // console.log(this.state.length)
            }
        }).catch(error=>{
            alert(error)
        })
    }
    componentDidMount() {
        this.change(this.state.repeat,this.state.remind_at)
       this.getApi()
    }
    //获取表单
    handleChange=(e)=>{
        this.setState({name:e.target.value})
        console.log(this.state)
    }
    //更新
    handleBlur1=()=>{
        let data={
            name:this.state.name,
            remind_at:this.state.remind_at,
            repeat:this.state.repeat
        }
        axios.post(`https://www.it266.com/app/todo/update?id=${this.state.id}&token=${this.state.token}`,qs.stringify(data))
            .then(res=>{
                if (res.status){
                    this.setState({num:1,message:"已更新"})
                    setInterval(()=>{
                        this.setState({num:0})
                    },3000)
                     this.state.history().push("/pages")
                }
            }).catch(error=>{
            alert(error)
        })

    }
    //删除
    handleBlur2=()=>{
        let data={
            id:this.state.id,
        }
        axios.post(`https://www.it266.com/app/todo/delete?token=${this.state.token}`,qs.stringify(data))
            .then(res=>{
                console.log(res)
                if (res.status){
                    this.setState({num:1,message:"已删除"})
                    setInterval(()=>{
                        this.setState({num:0})
                    },3000)
                    this.state.history().push("/pages")
                }
            }).catch(error=>{
            alert(error)
        })
    }
    //结束
    handleBlur3=()=>{
        let data={
            id:this.state.id,
        }
        axios.post(`https://www.it266.com/app/todo/finish?token=${this.state.token}`,qs.stringify(data))
            .then(res=>{
                console.log(res.status)
                console.log(res.data)
                if (res.data.status){
                    this.setState({num:1,message:res.data.data})
                    setInterval(()=>{
                        this.setState({num:0})
                    },3000)
                    // this.state.history().push("/pages")
                }
                else{
                    this.setState({num:1,message:res.data.data})
                    setInterval(()=>{
                        this.setState({num:0})
                    },3000)
                }
            }).catch(error=>{
            alert(error)
        })
    }
    //新增
    handleBlur4=()=>{
        let data={
            name:this.state.name,
            remind_at:this.state.remind_at,
            repeat:this.state.repeat
        }
        axios.post(`https://www.it266.com/app/todo/create?token=${this.state.token}`,qs.stringify(data))
            .then(res=>{
                console.log(res.data.status)
                if (res.data.status){
                    this.setState({num:1,message:'已添加'})
                    setInterval(()=>{
                        this.setState({num:0})
                    },3000)
                    this.state.history().push("/pages")
                }

            }).catch(error=>{
            alert(error)
        })

    }

    render() {
        return (
            <div className={"exit"}>
                <Header></Header>
                <div className="weui-cells weui-cells_form ">
                    <div className="weui-cell weui-cell_active">
                        <div className="weui-cell__bd">
                            <input className="weui-input" type="texta" value={this.state.name} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="page__bd page__bd_spacing">
                        <div  className="weui-btn weui-btn_default" id="showPicker">重复</div>
                        <div  className="weui-btn weui-btn_default time" id="showDatePicker">时间</div>
                        <div className="weui-btn weui-btn_default" onClick={this.handleBlur1}>更新</div>
                        <div className="weui-btn weui-btn_default" onClick={this.handleBlur2}>删除</div>
                        <div className="weui-btn weui-btn_default time" onClick={this.handleBlur3}>结束</div>
                        <div className="weui-btn weui-btn_default" onClick={this.handleBlur4}>新增</div>
                    </div>
                </div>
                <div id="toast" style={{display: !this.state.num?'none':"block"}}>
                    <div className="weui-mask_transparent"></div>
                    <div className="weui-toast">
                        <i className="weui-icon-success-no-circle weui-icon_toast"></i>
                        <p className="weui-toast__content">{this.state.message}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Exit;