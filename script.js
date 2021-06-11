var ctx = document.getElementById('myChart').getContext('2d');
var list =document.getElementById('side')
let httpReq=new XMLHttpRequest()
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
function divClicked(e){
    let code=e.target.getAttribute('id');
    httpReq.open("GET","https://api.covid19api.com/dayone/country/"+code, true)
    httpReq.onreadystatechange=function(){
        if(httpReq.readyState==4 && httpReq.status==200){
            let raw=JSON.parse(httpReq.response)
            let labels=raw.map(e=>{
                let d=new Date(e.Date)
                day=d.getDate();
                month=d.getMonth()+1;
                return `${day}-${month}`
            }) 
            let confirmed=raw.map(e=>e.Confirmed)
            let recovered=raw.map(e=>e.Recovered)
            let death=raw.map(e=>e.Deaths)  
            let active=raw.map(e=>e.Active)  

            let datasets=[
                {
                    label:'confirmed',
                    data: confirmed,
                    borderColor: 'blue',
                    borderWidth: 1
                },
                {
                    label:'recovered',
                    data: recovered,
                    borderColor: 'green',
                    borderWidth: 1,
                    size:150
                },
                {
                    label:'death',
                    data: death,
                    borderColor: 'red',
                    borderWidth: 1
                },
                {
                    label:'active',
                    data: active,
                    borderColor: 'yellow',
                    borderWidth: 1
                }
            ]
            myChart.data.labels=labels;         
            myChart.data.datasets=datasets;
            myChart.update()
        }
     }
     httpReq.send()
}
httpReq.open("GET","https://api.covid19api.com/countries", true)
httpReq.onreadystatechange=function(){
    if(httpReq.readyState==4 && httpReq.status==200){
        let resp =JSON.parse(httpReq.response).sort((a,b)=>a.Country>b.Country?1:-1)
        resp.forEach(element => {
            let d=document.createElement("div")
            d.setAttribute('id',element.ISO2)
            d.setAttribute('class','listItem')
            d.innerHTML=element.Country
            d.addEventListener('click',divClicked)
            list.append(d)
        });   
    }
}
httpReq.send()