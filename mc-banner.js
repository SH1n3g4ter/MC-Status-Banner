// Window load //
window.onload = function(){
    loadMCBanner();
}

function setBannerContentOnline(data){
    return `<div class="mc-top">
                <img src="${data.icon}">
                <span class="mc-sub-top">
                    <span class="mc-title">${data.hostname}</span>
                    <span class="mc-header">${data.motd.html}</span>
                </span>
            </div>
            <h4 id="playercount">
                <div style="display:inline;margin: 0 5px 0 0;">
                    <span style="color:#AAAAAA;">${data.players.online}</span>
                    <span style="color:#555555;">/</span> <span style="color:#AAAAAA;">${data.players.max}</span>
                </div>
                <span class="couponcode">
                    <div class="ping-badge great"> </div>
                </span>
            </h4>
            <div id="playerlist-container" style="margin:0 0 5px 0; display: none">
                <h4 style="margin:1rem 0">Players Online:</h4>
                <span id="playerlist">Loading...</span>
            </div>`;
}

function setBannerContentOffline(host){
    return `<div class="mc-top">
                <img src="server-icons/gray_noicon.png">
                <span class="mc-sub-top">
                <span class="mc-title">${host}</span>
                <span class="mc-header" style="color:#AA0000;">Can\'t connect to server</span> </span>
            </div>
            <h4 id="playercount">
                <div style="display:inline;margin: 0 5px 0 0;">
                    <span style="color:#AAAAAA;"></span>
                    <span style="color:#555555;"></span>
                    <span style="color:#AAAAAA;"></span>
                </div>
                <span class="couponcode">
                    <div class="ping-badge bad"> </div>
                </span> 
            </h4>`;
}

// --- Functions --- //
//send request and kickstart the rest of the banner
function loadMCBanner(){ 
    bannerItems = document.getElementsByClassName('mc-banner-in');
    console.log(bannerItems);
    for(let bannerEl of bannerItems){
        // Get mc-banner //
        let getMC = new XMLHttpRequest;
        getMC.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json_resp = JSON.parse(getMC.responseText);
                console.log(json_resp);
                if(json_resp.online == false){
                    bannerEl.innerHTML = setBannerContentOffline(bannerEl.dataset.serverIp);
                }else{
                    bannerEl.innerHTML = setBannerContentOnline(json_resp);
                    getPlayerList(json_resp);
                }
            }
        };
        // loading animation
        bannerEl.innerHTML = '<center><div class="lds-ellipsis white"><div></div><div></div><div></div><div></div></div></center>';
        console.log(bannerEl.dataset.serverIp);
        getMC.open("GET", "https://api.mcsrvstat.us/2/"+bannerEl.dataset.serverIp, true);
        getMC.send();
    }
    
}

//use the json requested to list all players
function getPlayerList(data){
    document.getElementById('playerlist').innerHTML = null;
    if(data.players.list == null){
        if(parseInt(data.players.online) > 0){
            document.getElementById('playerlist-container').style.display = 'none';
        }
        document.getElementById('playerlist').innerHTML = "None";
    }else{
        document.getElementById('playerlist-container').style.display = 'inline';
        document.getElementById('playerlist').innerHTML = '';
        for (i = 0; i < data.players.list.length; i++) {
            document.getElementById('playerlist').innerHTML += `<div class="mc-tooltip">
                                                                    <img src="https://minotar.net/avatar/${data.players.list[i]}/16.png">
                                                                    <span style="display:inline-block;"> ${data.players.list[i]}</span>
                                                                </div>`;
        }
    }
}