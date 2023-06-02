let cookieString = document.cookie;
let key = window.localStorage.getItem("key");
let videoI = cookieString.split(",")[0];
let channelI = cookieString.split(",")[1];
let channelId = channelI.split("=")[1];

const commentSection  = document.getElementById("commentSection");

let videoId = videoI.split("=")[1];
let firstScript = document.getElementsByTagName("script")[0];
firstScript.addEventListener("load",onloadeddata);

function onloadeddata(){
    if(YT){
        new YT.Player("azmat",{
            height:"600",
            width:"800",
            videoId,
        })
    }
   
}
loadChannelData();
async function loadChannelData(){

   try {
    let response = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${key}`);
    let result = await response.json();

    let response2 = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${key}`);
    let result2 = await response2.json();

    let name = result.items[0].snippet.title;
    let subscribers =  result.items[0].statistics.subscriberCount;
    let likes =  result2.items[0].statistics.likeCount;
    // console.log(name,subscribers,likes)
    addData(name,subscribers,likes);
   } catch (error) {
    alert("inside first");
   }
   
}
function addData(name,subscribers,likes){
    const n = document.getElementById("n");
    const s = document.getElementById("s");
    const l = document.getElementById("l");
    n.innerText = name;
    s.innerText= subscribers+" subscribers";
    l.innerText=likes;
}
collectCommentData(videoId);

async function collectCommentData(videoId){

   try {
    let response3 = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${key}`)
    let result3 = await response3.json();
    collectCommentData2(result3.items);
   
   } catch (error) {
    alert("inside second");
   }
    
    
}

function collectCommentData2(arr){
    for(let i =0;i<arr.length;i++){
        addTopLeveComment(arr[i].snippet);
    }
}
function addTopLeveComment(obj){
    //commentSection
    let textDislplay = obj.topLevelComment.snippet.textDisplay;
    let authorDisplayName= obj.topLevelComment.snippet.authorDisplayName;
    let authorProfileImageUrl =obj.topLevelComment.snippet.authorProfileImageUrl;
    let likeCount = obj.topLevelComment.snippet.likeCount;
    let canReply=obj.canReply;
    let totalReplyCount = obj.totalReplyCount;

    const div1 = document.createElement("div");
    div1.className="cardimg";
    const img = document.createElement("img");
    div1.append(img);

    const div2 = document.createElement("div");
    const h4 = document.createElement("h4");
    const p = document.createElement("p");

    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
    const span3 = document.createElement("span");

    span1.className="material-symbols-outlined";
    span3.className="material-symbols-outlined";
    span1.innerText="thumb_up";
    span3.innerText="thumb_down";

    span2.innerText = likeCount;
    span2.className="cardspanlikecount";
    h4.innerText = authorDisplayName;
    p.innerText=textDislplay;
    img.src=authorProfileImageUrl;

    const span4 = document.createElement("span");
    span4.innerText="reply"+"("+totalReplyCount+")";

    div2.append(h4);
    div2.append(p);
    div2.append(span1);
    div2.append(span2);
    div2.append(span3);
    div2.append(span4);

    const card = document.createElement("div");
    card.className = "card";
    card.append(div1);
    card.append(div2);
    
   

    commentSection.append(card);

}
