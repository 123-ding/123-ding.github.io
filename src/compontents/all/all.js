import React, {Component} from 'react';
import "weui"
import axios from "axios"
import qs from "qs";
import $ from "jquery";
import weui from 'weui.js'
import "./style.css"
import Header from "../header/header";
import {Link} from "react-router-dom";
class All extends Component {


    state={
        token:window.localStorage.getItem('token'),
        name:'',// 事项说明
        remind_at:"",// 提醒时间 格式 yyyy-mm-dd hh:ii:ss
        repeat:"",//重复(0不重复 1每天 2每周 3每⽉ 4每季度 5每年)
        item_count:'',//总条数
        num:0,//做判断需要显示
        length:[],//获取信息
        value1 : window.sessionStorage.getItem('titles'),//小标签
        id:'',//单个id
        ian:'',//控制数据加载时显示
        lengths:[]//拉取新的信息
    }
    //获取信息,定义方法
    getApi(){
        this.setState({ian:1})
        axios.get(`https://www.it266.com/app/todo?token=${this.state.token}`).then(res=>{

            if (res.status){
                setTimeout(()=>{
                    this.setState({item_count:res.data.data.page.item_count,length:res.data.data.data,ian:0})
                    this.state.length.map((item,key)=>{
                        axios.get(`https://www.it266.com/app/todo/detail?id=${item.id}&token=${this.state.token}`).then(res=>{

                            if (res.status){
                                setTimeout(()=>{
                                    this.setState({lengths:[...this.state.lengths,res.data.data]})
                                },0)
                            }
                        }).catch(error=>{
                            alert(error)
                        })
                    })
                },0)


    }})}
    //挂载
    componentDidMount(){
        if(this.state.value1==='新增'){
            this.change(this.state.repeat,this.state.remind_at)
            setTimeout(() => {
                this.setState({num:1})
            },0)
        }
        if(this.state.value1==="全部"){
            this.getApi()
            setTimeout(() => {
                this.setState({num:2})
            },0)
        }
    }
    //时间,重复选择
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
                onConfirm: function (result) {
                    repeat=result[0].value
                    _this.setState({repeat:result[0].value})
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
                },
                title: '日期'
            });
        });

    }
    //
    handlecilck=()=>{

    }
    handleChange=(e)=>{
        this.setState({name:e.target.value})
    }
    //提交新增标新增
    handleBlur=()=>{
        let data={
            name:this.state.name,
            remind_at:this.state.remind_at,
            repeat:this.state.repeat
        }
        axios.post(`https://www.it266.com/app/todo/create?token=${this.state.token}`,qs.stringify(data))
            .then(res=>{
                if (res.status){
                    this.getApi()
                }
        }).catch(error=>{
            alert(error)
        })
    }
    render() {
        return (
            <div className={"all"}>
                <Header></Header>
                <h1>{this.state.value1}</h1>
               <div className="weui-cells weui-cells_form new" style={{display:this.state.num===1?"block":"none"}}>
                    <div className="weui-cell weui-cell_active">
                        <div className="weui-cell__bd">
                            <input className="weui-input" type="text" placeholder="添加文本" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="page__bd page__bd_spacing">
                        <div  className="weui-btn weui-btn_default" id="showPicker">重复</div>
                        <div  className="weui-btn weui-btn_default" id="showDatePicker">时间</div>
                        <div className="weui-btn weui-btn_default" onClick={this.handleBlur}>提交</div>
                    </div>
                </div>
                {(()=>{
                    switch (this.state.num){
                        //新增
                        case 1:
                            return(
                               <p></p>)
                            break;
                        case 2:
                            return(
                                this.state.lengths.map((item,key)=>{
                                    return(
                                        <div className="weui-cells case" key={"key"}>
                                            <Link className="weui-cell weui-cell_access weui-cell_example add" to={`/exit/${item.id}`} onClick={()=>{
                                                window.sessionStorage.setItem('titles',"编辑");
                                                window.sessionStorage.setItem('title','编辑');
                                                window.sessionStorage.setItem('id',`${item.id}`);
                                            }}>
                                                <div className="weui-cell__bd">
                                                    <p>{item.name}</p>
                                                    <div>提醒时间: {item.remind_at}</div>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            );
                            break;
                        default:return null;
                    }
                })()}
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
export default All;