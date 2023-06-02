
let btn  = document.getElementById("searchButton");
let searchBox = document.getElementById("search");
let key  = "AIzaSyAAw-IoiAjEaWSARj7cIdnvyb-ATI7etyo";
window.localStorage.setItem("key",key);
searchBox.addEventListener("keypress",function(event){
    if(event.keyCode===13){
        loadData();
    }
});
async function loadData(){
    let v = searchBox.value;
    console.log(v);
    try {
    let a  = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${v}&key=${key}`);
    let result = await a.json();
    addVideo(result.items);
    console.log(result)
    } catch (error) {
        console.log(error);
    }
}
function addVideo(result){

    let div  = document.getElementById("container");
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    for(let i =0;i<result.length;i++){
       
        let imageUrl = result[i].snippet.thumbnails.high.url;
        let tittle = result[i].snippet.title;
        let channelTittle = result[i].snippet.channelTitle;
        let viewId = result[i].id.videoId;
        addVideoOneByOne(imageUrl,tittle,channelTittle,div,viewId);
    }
    
}
async function addVideoOneByOne(imageUrl,tittle,channelTittle,div,viewId){

    let response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${viewId}&key=${key}`);
    let result = await response.json();
    console.log(result,"fd");

    if(result.items.length>0){
        let contentDetails = result.items[0].contentDetails;
        let statistics = result.items[0].statistics;
    
        let duration = contentDetails.duration;
        let viewCount = statistics.viewCount;
    
        let channelId = result.items[0].snippet.channelId;
        let durationDiv = document.createElement("div");
        durationDiv.className = "d";
       
    
       viewCount = convert(viewCount);
       
        let mins = duration.split(2,4);
        let second = duration.split(6,duration.length-1);
    
        // let duration = "5465"
        // let viewCount ="47\57" 
        let videoBox  = document.createElement("div");
        videoBox.className="videoBox";
    

       duration = convertToTime(duration);
        durationDiv.innerText = duration;

        let headerVideo = document.createElement("div");
        let img = document.createElement("img");
        // img.src=imageUrl;
        // headerVideo.append(img);
        headerVideo.style.backgroundImage = `url(${imageUrl})`;
        headerVideo.className="headerVideo"
        let footerVideo = document.createElement("div");
        footerVideo.innerHTML=`<p>${tittle}</p><p>${channelTittle}</p><p class="duration-content"><span>${viewCount}</span></p>`;
        
        headerVideo.append(durationDiv);
        videoBox.append(headerVideo);
        videoBox.append(footerVideo);
        // let a  = document.createElement("a");
        videoBox.addEventListener("click",()=>{
            nextPage(viewId,channelId);
        });
        // a.href="./player.html";
        // a.append(videoBox);
        div.append(videoBox);

    }
   
}
function nextPage(viewId,channelId){
    let a = document.createElement('a');
    document.cookie=`video=${viewId},channelId=${channelId}`;
    a.href="./player.html";
    a.target="_blank";
    a.click();
}
function convert(viewCount){
    if(parseInt(viewCount)>1000&&parseInt(viewCount)<=999999){
        return parseInt(viewCount)/1000+"k";
    }
    else if(parseInt(viewCount)>999999){
        return parseInt(viewCount)/10000000+"M";
    }
    return viewCount;
   }
   function convertToTime(duration){
    const a = duration.slice(2);
    let str = "HMS"
    let ans = "";
    for(let i =0;i<a.length;i++){
        let c = a[i];
        if(str.indexOf(c)>0&&i<a.length-1){
            ans+=":";
        }
        else if(i<a.length-1){
            ans+=a[i];
        }
       
    }
    return ans;
   }

