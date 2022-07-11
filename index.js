window.onload = function () {

    // 导航点击模块
    var audience = document.querySelector('.audience-two');

    var slider = document.querySelector('.slider');
    var li = document.querySelectorAll('.audience-two li');
    for (var i = 0; i < li.length; i++) {

        // 鼠标移动事件
        li[i].onmouseover = function () {
            slider.style.left = this.offsetLeft + audience.offsetLeft  +'px'
        }

        // 鼠标点击事件
        li[i].onmouseup = function () {
            slider.style.left = this.offsetLeft + audience.offsetLeft + 'px';
        }

    }



    // 鼠标经过时，左右按钮出现

    var arrowLeft = document.querySelector('.jiantou-left');
    var arrowRight = document.querySelector('.jiantou-right');
    var lunbo = document.querySelector('.lunbo');
    // 用来标识左右按钮的点击次数
    var num = 0;
    lunbo.addEventListener('mouseenter', function () {
        arrowLeft.style.display = 'block';
        arrowRight.style.display = 'block';
        // 清除定时器
        clearInterval(time);
        time = null;
    })

    // 鼠标离开时，左右按钮消失
    lunbo.addEventListener('mouseleave', function () {
        arrowLeft.style.display = 'none';
        arrowRight.style.display = 'none';
        // 开始定时器
        time = setInterval(() => {
            arrowRight.onclick()
        }, 2000)
    })

    // 来控制点击左右按钮时，圆圈样式变化
    var circle = 0;

    // 动态生成圆圈
    var pics = document.querySelector('.pics');
    var lis = document.querySelector('.pics').children;
    var btns = document.querySelector('.btn');
    for (let i = 0; i < lis.length; i++) {
        var li = document.createElement('li');
        // 设置自定义属性
        li.setAttribute('index', i);
        btns.appendChild(li)

        // 圆圈点击事件
        li.onclick = function () {
            for (let j = 0; j < btns.children.length; j++) {
                btns.children[j].style.backgroundColor = ''
            }
            this.style.backgroundColor = 'red'

            // 点击圆圈，图片移动
            //获得宽度
            pics.style.left = '-' + lis[0].offsetWidth * this.getAttribute('index') + 'px'
            num = this.getAttribute('index');
            circle = this.getAttribute('index');
        }
    }
    // 给第一个小圆圈设置样式
    btns.children[0].style.backgroundColor = 'red'

    //无缝连接
    var first = pics.children[0].cloneNode(true);
    pics.appendChild(first);
    // 点击左右按钮，图片移动
    arrowLeft.onclick = function () {
        if (num == 0) {
            pics.style.left = -num * lis[0].offsetWidth + 'px';
            num = pics.children.length - 1;
        }
        num--;

        circle--;
        if (circle < 0) {
            circle = btns.children.length - 1;
        }

        pics.style.left = '-' + lis[0].offsetWidth * num + 'px';
        circleChange()
    }

    arrowRight.onclick = function () {

        if (num == pics.children.length - 1) {
            pics.style.left = 0;
            num = 0
        }
        num++;
        circle++;

        if (circle == btns.children.length) {
            circle = 0;
        }

        pics.style.left = '-' + lis[0].offsetWidth * num + 'px';
        circleChange()
    }

    // 圆圈样式变化
    function circleChange() {
        for (var j = 0; j < btns.children.length; j++) {
            btns.children[j].style.backgroundColor = ''
        }
        btns.children[circle].style.backgroundColor = 'red'
    }

    let time = setInterval(() => {
        arrowRight.onclick()
    }, 2000)


    // // 数据可视化请求，利用ajax
    // var request = new XMLHttpRequest();
    // // 实例化请求对象
    // request.open("GET", " https://edu.telking.com/api/?type=month");
    // // 监听 readyState 的变化
    // request.onreadystatechange = function () {
    //     // 检查请求是否成功
    //     if (this.readyState === 4 && this.status === 200) {
    //         // 将来自服务器的响应插入当前页面
    //         let Textdata = JSON.parse(this.responseText);
    //         let xAxis = Textdata.data.xAxis;
    //         let series = Textdata.data.series
    //         charts(xAxis,series)
    //     }
    // };
    // // 将请求发送到服务器
    // request.send();


    // 封装ajax请求
    function request(params) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            // 实例化请求对象
            request.open("GET", `https://edu.telking.com/api/?type=${params}`);
            // 监听 readyState 的变化
            request.onreadystatechange = function () {
                // 检查请求是否成功
                if (this.readyState === 4 && this.status === 200) {
                    // 将来自服务器的响应插入当前页面

                    let Textdata = JSON.parse(this.responseText);
                    resolve(Textdata);
                }
            };
            // 将请求发送到服务器
            request.send();
        })
    }

    // 请求月数据
    function goMonth(month) {
        request(month).then((res) => {
            charts(res.data.xAxis, res.data.series)
        })
    }
    goMonth('month')
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    function charts(x_data, y_data) {
        myChart.setOption({
            title: {
                text: '曲线图数据展示',
                left: "center",
            },
            tooltip: {},
            xAxis: {
                data: x_data
            },
            yAxis: {},
            color: ['#4b9dff'],
            series: [{
                name: '销量',
                type: 'line',
                smooth: true,
                data: y_data,
                areaStyle: {
                    color: '#72b2ff'
                },
                
            }],
            grid: {
                containLabel: true,
                bottom: '3%',
                left: '3%',
                right: '3%',
              }
        })
    }


    // 请求周数据
    function goDate(value) {
        request(value).then((res) => {
            charts_left(res.data)
            echart_right(res.data)
        })
    }
    goDate('week');

    var echart_left = echarts.init(document.getElementById('echarts-left'));

    // 指定图表的配置项和数据  周数据饼状图
    function charts_left(res) {
        let Option = {
            title: {
              text: "周报饼图",
              left: "center",
            },
            tooltip: {
              show: true,
            },
            // color: ['#4b9dff'],
            series: [
              {
                type: 'pie',
                radius: '60%',
                data: [
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ],
            grid: {
              containLabel: true,
              bottom: '3%',
              left: '3%',
              right: '3%',
            }
          };

        for (let i = 0; i < res.series.length; i++) {
            let obj = {
                value: res.series[i],
                name: res.xAxis[i]
            }
            Option.series[0].data.push(obj)
        }
        echart_left.setOption(Option)

    }


    // 柱状图

    function echart_right(res) {
        var echart_right = echarts.init(document.getElementById('echarts-right'));
        let option = {
            title: {
              text: "周报柱形图",
              left: "center",
            },
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            color: ['#4b9dff'],
            series: [
              {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'bar',
                barWidth: 20,
              }
            ],
            grid: {
              containLabel: true,
              bottom: '3%',
              left: '3%',
              right: '3%',
            }
          };
        
          option.xAxis.data = res.xAxis
          option.series[0].data = res.series
        
        
          echart_right.setOption(option)
    }

}