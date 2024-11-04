console.log('JS starts');
let currentsong = new Audio();
let songs;
let track;
function sectomin(seconds){
    const minutes = Math.floor(seconds/60);
    const remaining = Math.floor(seconds % 60);

    const formatmin = String(minutes).padStart(2,'0');
    const formatsec = String(remaining).padStart(2,'0');

    return `${formatmin}:${formatsec}`;
}

async function getsongs() {
   
        let response = await fetch('http://127.0.0.1:5500/public/');
        
        // Check if the response is OK (status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let text = await response.text();
        console.log('Fetched response:', text);

        let div = document.createElement("div");
        div.innerHTML = text;

        let as = div.getElementsByTagName("a");
        console.log('Links found:', as);

        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/public/")[1]);
            }
        }
        
        return songs;
    
}

const playmusic=(track) =>{
   // let audio = new Audio("/songs/" + track)
   currentsong.src= "/public/" + track
   currentsong.play()
    play.src ="pause.svg"
    document.querySelector(".songInfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
async function main(){
   
    songs = await getsongs();
    console.log(songs);

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML+ `<li>
                            <div class="songinfo">
                            
                            <div class="info">
                                <div>Song</div>
                                <div>${song.replaceAll("%20"," ")}</div>
                            </div>
                            </div>
                            <img src="play.svg" alt="">
                          </li>`;
    }

    //play first song
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata",() => {
        let duration = audio.duration;
        console.log(audio.duration,audio.currentSrc,audio.currentTime)
    })

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").children[1].innerHTML)
            playmusic(e.querySelector(".info").children[1].innerHTML.trim())
        })
        
    })
    //play next and prev
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src ="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="playpause.svg"
        }
    })
    //select song
    let previousSong = null;

document.querySelectorAll(".songlist > ul > li").forEach(song => {
    song.addEventListener("click", (e) => {
        if (previousSong) {
            previousSong.style.backgroundColor = ""; 
        }
        e.currentTarget.style.backgroundColor = "#555";
        previousSong = e.currentTarget;
    });
});

    //timeupdate
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${sectomin(currentsong.currentTime)} / ${sectomin(currentsong.duration)}`;
        document.querySelector(".circle").style.left = ( currentsong.currentTime / currentsong.duration)*100 + "%"
    })

    //aad seekbar func
    
    document.querySelector(".playtrack").addEventListener("click",e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent )/ 100;
    })

    //prev and next
    prev.addEventListener("click", () => {
        const currentSongName = currentsong.src.split("/").slice(-1)[0];
        const currentIndex = songs.findIndex(song => song.endsWith(currentSongName));
        let previousIndex;
        if (currentIndex !== -1 && currentIndex > 0) {
            previousIndex = currentIndex - 1;
        } else {
            
            previousIndex = songs.length - 1;
        }
        const previousSongName = songs[previousIndex];
        playmusic(decodeURIComponent(previousSongName));
    });
    
    next.addEventListener("click", () => {
        const currentSongName = currentsong.src.split("/").slice(-1)[0];
        const currentIndex = songs.findIndex(song => song.endsWith(currentSongName));
       let nextIndex;
       if (currentIndex !== -1 && currentIndex + 1 < songs.length) {
           nextIndex = currentIndex + 1;
       } else {
           
           nextIndex = 0;
       }
       const nextSongName = songs[nextIndex];
       playmusic(decodeURIComponent(nextSongName));
    });
    
    
    
    
}
main()
